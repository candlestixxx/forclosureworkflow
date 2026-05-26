import { z } from "zod";

export const LeadCreationSchema = z.object({
  ownerName: z.string().min(1, "Owner name is required"),
  propertyAddress: z.string().min(1, "Property address is required"),
  city: z.string().optional().nullable(),
  zip: z.string().optional().nullable(),
  saleDate: z.string().optional().nullable(),
  noticeStatus: z.string().optional().default("New"),
  bestPhone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  rawNoticeText: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  needsAddressMatch: z.boolean().optional().default(false),
});

export const IntakePayloadSchema = z.object({
  notices: z.union([z.string(), z.array(z.string())]),
  source: z.string().optional(),
});
