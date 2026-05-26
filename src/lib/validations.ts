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
  countyConfig: z.string().optional().default("MI_MACOMB"),
});

export const SettingsSchema = z.object({
  webhookUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional().nullable(),
  hubspotApiKey: z.string().optional().nullable(),
});

export const ContactSchema = z.object({
  leadId: z.string(),
  type: z.enum(["Phone", "Email"]),
  value: z.string().min(1, "Value is required"),
  isPrimary: z.boolean().optional().default(false),
  confidence: z.union([z.string(), z.number()]).optional().nullable(),
  source: z.string().optional().default("Manual Enrichment"),
});

export const TaskSchema = z.object({
  leadId: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

export const RelativeSchema = z.object({
  leadId: z.string(),
  name: z.string().min(1, "Name is required"),
  relation: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
});
