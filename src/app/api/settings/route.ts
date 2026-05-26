import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const revalidate = 300; // Cache settings endpoint for 5 minutes

export async function GET() {
  try {
    const settings = await prisma.setting.findUnique({
      where: { id: "global" }
    });

    return NextResponse.json(settings || { webhookUrl: "", hubspotApiKey: "" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const settings = await prisma.setting.upsert({
      where: { id: "global" },
      update: { webhookUrl: body.webhookUrl, hubspotApiKey: body.hubspotApiKey },
      create: { id: "global", webhookUrl: body.webhookUrl, hubspotApiKey: body.hubspotApiKey }
    });

    revalidatePath("/api/settings");
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
