import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    if (!body.content || !body.leadId) {
      return NextResponse.json({ error: "content and leadId are required" }, { status: 400 });
    }
    const lead = await prisma.lead.findUnique({ where: { id: body.leadId } });
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    const newNote = await prisma.leadNote.create({
      data: {
        content: body.content,
        leadId: body.leadId,
      },
    });
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
