import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
