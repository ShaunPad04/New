import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Internal Complaints Procedure" };

export default function Page() {
  return <LegalPage slug="internal-complaints-procedure" />;
}
