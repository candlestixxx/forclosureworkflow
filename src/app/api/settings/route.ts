import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { SettingsSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export const revalidate = 300; // Cache settings endpoint for 5 minutes

export async function GET() {
  try {
    const settings = await prisma.setting.findUnique({
      where: { id: "global" }
    });

    return NextResponse.json(settings || {
      webhookUrl: "", hubspotApiKey: "", ghlApiKey: "",
      twilioAccountSid: "", twilioAuthToken: "", twilioFromNumber: "", sendgridApiKey: "", openAiApiKey: ""
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const validation = SettingsSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid settings payload", details: validation.error.format() }, { status: 400 });
    }
    const body = validation.data;

    const settings = await prisma.setting.upsert({
      where: { id: "global" },
      update: {
        webhookUrl: body.webhookUrl, hubspotApiKey: body.hubspotApiKey, ghlApiKey: body.ghlApiKey,
        twilioAccountSid: body.twilioAccountSid, twilioAuthToken: body.twilioAuthToken, twilioFromNumber: body.twilioFromNumber, sendgridApiKey: body.sendgridApiKey, openAiApiKey: body.openAiApiKey
      },
      create: {
        id: "global", webhookUrl: body.webhookUrl, hubspotApiKey: body.hubspotApiKey, ghlApiKey: body.ghlApiKey,
        twilioAccountSid: body.twilioAccountSid, twilioAuthToken: body.twilioAuthToken, twilioFromNumber: body.twilioFromNumber, sendgridApiKey: body.sendgridApiKey, openAiApiKey: body.openAiApiKey
      }
    });

    revalidatePath("/api/settings");
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
