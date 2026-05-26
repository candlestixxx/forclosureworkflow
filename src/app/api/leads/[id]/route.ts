import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const lead = await prisma.lead.findUnique({
      where: { id: resolvedParams.id },
      include: {
        contacts: true,
        notes: true,
        tasks: true,
        tags: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();

    if (body.saleDate) {
      body.saleDate = new Date(body.saleDate);
    } else if (body.saleDate === "") {
      body.saleDate = null;
      body.saleDate = new Date(body.saleDate);
    }

    const updatedLead = await prisma.lead.update({
      where: { id: resolvedParams.id },
      data: body,
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await prisma.lead.delete({
      where: { id: resolvedParams.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
