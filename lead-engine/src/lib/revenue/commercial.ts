import type { CommercialModel } from "../clients/types";
import type { Booking, Lead } from "../domain/types";

export type FeeResult =
  | { known: true; amount: number; currency: string; explanation: string }
  | { known: false; reason: string };

/**
 * BlackLine's fee on a lead. The point of the `unconfigured` branch is that a
 * number nobody agreed is worse than no number: the dashboard shows the gap
 * instead of a confident, wrong figure.
 */
export function feeForLead(lead: Lead, model: CommercialModel): FeeResult {
  if (model.kind === "unconfigured") {
    return {
      known: false,
      reason: "The commercial terms with this client have not been recorded, so BlackLine's fee cannot be calculated.",
    };
  }

  const booking: Booking | undefined = lead.booking;
  const booked = lead.status === "booked";

  switch (model.kind) {
    case "per_qualified_lead": {
      const qualifies = Boolean(lead.handoffSentAt);
      return qualifies
        ? {
            known: true,
            amount: model.feePerLead,
            currency: model.currency,
            explanation: `Flat fee per qualified lead handed over.`,
          }
        : { known: false, reason: "The fee applies on handover, which has not happened yet." };
    }
    case "per_booking": {
      return booked
        ? { known: true, amount: model.feePerBooking, currency: model.currency, explanation: "Flat fee per booking." }
        : { known: false, reason: "The fee applies when the lead books." };
    }
    case "percentage_commission": {
      if (!booked) return { known: false, reason: "Commission applies when the lead books." };
      if (booking?.value === undefined) {
        return { known: false, reason: "The booking value has not been recorded, so commission cannot be calculated." };
      }
      return {
        known: true,
        amount: round2((booking.value * model.percentage) / 100),
        currency: booking.currency || model.currency,
        explanation: `${model.percentage}% of a ${formatMoney(booking.value, booking.currency || model.currency)} booking.`,
      };
    }
    case "hybrid": {
      const parts: string[] = [];
      let amount = 0;
      if (model.feePerLead !== undefined && lead.handoffSentAt) {
        amount += model.feePerLead;
        parts.push(`${formatMoney(model.feePerLead, model.currency)} for the qualified lead`);
      }
      if (booked && model.feePerBooking !== undefined) {
        amount += model.feePerBooking;
        parts.push(`${formatMoney(model.feePerBooking, model.currency)} for the booking`);
      }
      if (booked && model.percentage !== undefined) {
        if (booking?.value === undefined) {
          return { known: false, reason: "The booking value has not been recorded, so the commission part cannot be calculated." };
        }
        const commission = round2((booking.value * model.percentage) / 100);
        amount += commission;
        parts.push(`${model.percentage}% commission (${formatMoney(commission, model.currency)})`);
      }
      if (parts.length === 0) return { known: false, reason: "No part of the hybrid model applies to this lead yet." };
      return { known: true, amount: round2(amount), currency: model.currency, explanation: parts.join(" + ") };
    }
  }
}

export function describeModel(model: CommercialModel): string {
  switch (model.kind) {
    case "unconfigured":
      return "Not agreed yet";
    case "per_qualified_lead":
      return `${formatMoney(model.feePerLead, model.currency)} per qualified lead`;
    case "per_booking":
      return `${formatMoney(model.feePerBooking, model.currency)} per booking`;
    case "percentage_commission":
      return `${model.percentage}% of booking value`;
    case "hybrid": {
      const parts = [
        model.feePerLead !== undefined ? `${formatMoney(model.feePerLead, model.currency)}/lead` : undefined,
        model.feePerBooking !== undefined ? `${formatMoney(model.feePerBooking, model.currency)}/booking` : undefined,
        model.percentage !== undefined ? `${model.percentage}% commission` : undefined,
      ].filter(Boolean);
      return parts.join(" + ");
    }
  }
}

export function formatMoney(amount: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Totals across a set of leads, keeping "cannot be calculated" visible. */
export function totalFees(leads: Lead[], model: CommercialModel): {
  total: number;
  currency: string;
  counted: number;
  uncalculable: number;
  reason?: string;
} {
  if (model.kind === "unconfigured") {
    return {
      total: 0,
      currency: "GBP",
      counted: 0,
      uncalculable: leads.length,
      reason: "Commercial terms have not been recorded for this client.",
    };
  }
  let total = 0;
  let counted = 0;
  let uncalculable = 0;
  for (const lead of leads) {
    const fee = feeForLead(lead, model);
    if (fee.known) {
      total += fee.amount;
      counted += 1;
    } else if (lead.status === "booked" || lead.handoffSentAt) {
      uncalculable += 1;
    }
  }
  return { total: round2(total), currency: model.currency, counted, uncalculable };
}
