import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import twilio from 'twilio';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const to = searchParams.get('to');

    if (!to) {
      return NextResponse.json({ error: "Missing 'to' parameter" }, { status: 400 });
    }

    const settings = await prisma.setting.findUnique({ where: { id: "global" } });

    if (!settings || !settings.twilioAccountSid || !settings.twilioAuthToken || !settings.twilioFromNumber) {
      return NextResponse.json({ error: "Twilio credentials not configured." }, { status: 400 });
    }

    const client = twilio(settings.twilioAccountSid, settings.twilioAuthToken);

    const call = await client.calls.create({
      twiml: `<Response><Say>Connecting you to the agent.</Say><Dial callerId="${settings.twilioFromNumber}">${to}</Dial></Response>`,
      to,
      from: settings.twilioFromNumber,
    });

    return NextResponse.json({ success: true, callSid: call.sid });

  } catch (error) {
    console.error("Twilio Voice API Error:", error);
    return NextResponse.json({ error: "Failed to initiate call via Twilio" }, { status: 502 });
  }
}
