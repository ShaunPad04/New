import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function Page() {
  return <LegalPage slug="terms-conditions" />;
}
