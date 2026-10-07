"use client";

import { useSearchParams } from "next/navigation";
import EnquiryForm from "@/components/EnquiryForm";

/** The form for layout B: it starts again whenever a tile changes ?type=, so the subject
 *  it shows always matches the tile just chosen. */
export default function EnquiryReasonForm() {
  const type = useSearchParams().get("type") ?? "";
  return <EnquiryForm key={type} />;
}
