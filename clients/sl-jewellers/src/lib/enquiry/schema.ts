import { z } from "zod";
import { ENQUIRY_TYPES } from "@/lib/content";

export const MAX_FILES = 3;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

const ukPhone = /^(\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3}$|^(\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4}$|^(\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}$/;

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a UK phone number")
    .max(20)
    .refine((v) => ukPhone.test(v.replace(/[\s-]/g, (m) => (m === " " ? " " : ""))) || /^\+?[\d\s()-]{10,20}$/.test(v), "Enter a UK phone number"),
  email: z.email("Enter a valid email address").max(120),
  type: z.enum(ENQUIRY_TYPES.map((t) => t.value) as [string, ...string[]], { message: "Choose an enquiry type" }),
  item: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(3000),
  contact: z.enum(["phone", "whatsapp", "email"], { message: "Choose how you would like us to reply" }),
  consent: z.literal("on", { message: "Please tick the consent box so we can reply to you" }),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const typeLabel = (v: string) => ENQUIRY_TYPES.find((t) => t.value === v)?.label ?? v;
