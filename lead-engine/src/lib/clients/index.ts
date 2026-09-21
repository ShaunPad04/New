import { CAMBRIDGE_MEWS } from "./cambridge-mews";
import { getSetting, setSetting } from "../db/settings";
import type { ClientConfig, CommercialModel } from "./types";

/**
 * One client for now. The registry exists so a second one is a data change
 * rather than a rewrite — but nothing here builds multi-tenant machinery
 * before the Cambridge Mews workflow has earned it.
 */
const CLIENTS: Record<string, ClientConfig> = {
  [CAMBRIDGE_MEWS.id]: CAMBRIDGE_MEWS,
};

export const DEFAULT_CLIENT_ID = CAMBRIDGE_MEWS.id;

export function getClient(id: string = DEFAULT_CLIENT_ID): ClientConfig {
  const base = CLIENTS[id];
  if (!base) throw new Error(`Unknown client "${id}".`);
  // Commercial terms are operational data, so they live in the database and
  // override the (deliberately unconfigured) compiled-in default.
  const stored = getSetting<CommercialModel>(`client:${id}:commercial`);
  if (!stored) return base;
  return {
    ...base,
    commercial: stored,
    verified: { ...base.verified, commercialTerms: stored.kind !== "unconfigured" },
  };
}

export function setCommercialModel(id: string, model: CommercialModel): void {
  setSetting(`client:${id}:commercial`, model);
}

export function listClients(): ClientConfig[] {
  return Object.values(CLIENTS);
}

export type { ClientConfig, CommercialModel } from "./types";
