import type { SourceType } from "../domain/types";

/**
 * Commercial terms between BlackLine and the client.
 *
 * The default is deliberately `unconfigured`. BlackLine's fee is never
 * assumed: until somebody records the agreed terms, the revenue screens say
 * so rather than printing a number nobody agreed to.
 */
export type CommercialModel =
  | { kind: "unconfigured" }
  | { kind: "per_qualified_lead"; currency: string; feePerLead: number }
  | { kind: "per_booking"; currency: string; feePerBooking: number }
  | { kind: "percentage_commission"; currency: string; percentage: number }
  | {
      kind: "hybrid";
      currency: string;
      feePerLead?: number;
      feePerBooking?: number;
      percentage?: number;
    };

export type IdealCustomerProfile = {
  id: string;
  label: string;
  description: string;
  /** Why this profile tends to need accommodation. Shown on the lead detail page. */
  accommodationRationale: string;
};

export type DiscoveryQuery = {
  sourceType: SourceType;
  label: string;
  /** Search strings handed to the configured provider, verbatim. */
  queries: string[];
  /** Freshness window in days; older results are dropped as stale signals. */
  maxAgeDays: number;
};

export type ClientConfig = {
  id: string;
  name: string;
  website: string;
  service: string;
  /** Where the client can actually accommodate people. */
  location: { town: string; region: string; country: string };
  /** Towns and areas whose work is close enough to matter. */
  targetAreas: string[];
  targetIndustries: string[];
  idealCustomerProfiles: IdealCustomerProfile[];
  discovery: DiscoveryQuery[];
  qualification: {
    /** Below this score a lead is never surfaced for outreach. */
    minimumScoreForOutreach: number;
    /** Above this score BlackLine is notified immediately. */
    notifyAtScore: number;
    /** Distance beyond which work is not worth pursuing, in km. */
    maxDistanceKm: number;
  };
  routing: {
    /** Who at the client receives handed-off leads. Empty until confirmed. */
    handoffRecipients: string[];
    handoffMethod: "manual" | "email" | "webhook";
  };
  outreach: {
    senderName: string;
    senderOrganisation: string;
    senderEmail: string;
    senderPhone: string;
    /** Sentences the drafts must never contain — see docs/INTEGRITY.md. */
    forbiddenClaims: string[];
  };
  commercial: CommercialModel;
  /** Facts about the client that BlackLine has confirmed in writing. */
  verified: {
    website: boolean;
    /** True only once the client has confirmed the commercial terms. */
    commercialTerms: boolean;
    handoffRecipients: boolean;
  };
};
