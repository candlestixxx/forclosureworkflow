import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const leadId = formData.get("leadId") as string | null;

    if (!file || !leadId) {
      return NextResponse.json({ error: "File and leadId are required." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    const fileUrl = await uploadToS3(buffer, file.name, file.type);

    // Save to Database
    const document = await prisma.document.create({
      data: {
        fileName: file.name,
        fileUrl: fileUrl,
        fileType: file.type || "application/octet-stream",
        leadId: leadId,
      },
    });

    return NextResponse.json({ success: true, document });
  } catch (error: any) {
    console.error("Document upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload document" }, { status: 500 });
  }
}
