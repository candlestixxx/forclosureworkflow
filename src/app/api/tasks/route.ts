import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { TaskSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const validation = TaskSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid task payload", details: validation.error.format() }, { status: 400 });
    }
    const body = validation.data;
    const newTask = await prisma.leadTask.create({
      data: {
        title: body.title,
        description: body.description,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        status: body.status || "Pending",
        type: body.type || "Follow-up",
        leadId: body.leadId,
      },
    });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
