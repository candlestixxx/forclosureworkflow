import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Simple sanitization: remove spaces and # symbols, convert to lowercase
    const tagName = body.name.toLowerCase().replace(/[\s#]/g, '');

    if (!tagName) {
      return NextResponse.json({ error: "Invalid tag name" }, { status: 400 });
    }

    const newTag = await prisma.leadTag.create({
      data: {
        name: tagName,
        leadId: body.leadId,
      },
    });

    return NextResponse.json(newTag, { status: 201 });
  } catch (error: any) {
    // Handle unique constraint violations silently for UX
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Tag already exists" }, { status: 409 });
    }
    console.error("Failed to add tag:", error);
    return NextResponse.json({ error: "Failed to add tag" }, { status: 500 });
  }
}
