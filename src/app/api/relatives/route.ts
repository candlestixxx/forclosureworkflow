import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { RelativeSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const validation = RelativeSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid relative payload", details: validation.error.format() }, { status: 400 });
    }
    const body = validation.data;

    const newRelative = await prisma.leadRelative.create({
      data: {
        leadId: body.leadId,
        name: body.name,
        relation: body.relation,
        phone: body.phone,
      },
    });

    return NextResponse.json(newRelative, { status: 201 });
  } catch (error) {
    console.error("Failed to create relative:", error);
    return NextResponse.json({ error: "Failed to create relative" }, { status: 500 });
  }
}
