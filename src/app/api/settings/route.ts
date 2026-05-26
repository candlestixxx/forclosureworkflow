import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const settings = await prisma.setting.findUnique({
      where: { id: "global" }
    });

    return NextResponse.json(settings || { webhookUrl: "" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const settings = await prisma.setting.upsert({
      where: { id: "global" },
      update: { webhookUrl: body.webhookUrl },
      create: { id: "global", webhookUrl: body.webhookUrl }
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
