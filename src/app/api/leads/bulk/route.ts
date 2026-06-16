import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const BulkActionSchema = z.object({
  leadIds: z.array(z.string()).min(1),
  action: z.enum(["status", "tag"]),
  value: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const validation = BulkActionSchema.safeParse(rawBody);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { leadIds, action, value } = validation.data;

    if (action === "status") {
      await prisma.lead.updateMany({
        where: { id: { in: leadIds } },
        data: { noticeStatus: value }
      });
    } else if (action === "tag") {
      const tagData = leadIds.map(id => ({
        leadId: id,
        name: value
      }));
      // Prisma createMany skipDuplicates avoids constraint errors if lead already has the tag
      await prisma.leadTag.createMany({
        data: tagData,
        skipDuplicates: true
      });
    }

    revalidatePath("/leads");
    revalidatePath("/segments");
    return NextResponse.json({ success: true, count: leadIds.length });
  } catch (error) {
    console.error("Bulk action error:", error);
    return NextResponse.json({ error: "Failed to process bulk action" }, { status: 500 });
  }
}
