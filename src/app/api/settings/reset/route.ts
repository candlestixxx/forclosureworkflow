import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    // Note: In production, ensure this is locked behind a strict admin role check.
    // The middleware currently protects this route by ensuring the user is authenticated.

    // Purge the database (cascading deletes will handle related models)
    await prisma.lead.deleteMany({});
    await prisma.auditLog.deleteMany({});

    // Re-initialize the global setting row
    await prisma.setting.upsert({
      where: { id: "global" },
      update: { webhookUrl: "", hubspotApiKey: "" },
      create: { id: "global", webhookUrl: "", hubspotApiKey: "" }
    });

    await logAudit("DATABASE_RESET", "User triggered a total database wipe.", "SUCCESS");

    return NextResponse.json({ message: "Database reset successfully." }, { status: 200 });
  } catch (error) {
    console.error("Database reset error:", error);
    return NextResponse.json({ error: "Failed to reset database." }, { status: 500 });
  }
}
