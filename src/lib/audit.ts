import { prisma } from "@/lib/prisma";

export async function logAudit(action: string, details: string, status: "SUCCESS" | "FAILURE") {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        details,
        status
      }
    });
  } catch (error) {
    console.error("Critical failure writing to AuditLog:", error);
  }
}
