import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const callSid = formData.get('CallSid') as string;
    const callStatus = formData.get('CallStatus') as string;
    const duration = formData.get('CallDuration') as string;

    // Log the webhook (for debugging)
    console.log(`[Twilio Webhook] Call ${callSid} Status: ${callStatus}`);

    // If we have a global io instance (from server.js), emit an event
    if ((global as any).io) {
        (global as any).io.emit('call-status-update', { callSid, callStatus, duration });
    }

    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
        headers: { 'Content-Type': 'text/xml' }
    });

  } catch (error) {
    console.error("Twilio Webhook Error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
