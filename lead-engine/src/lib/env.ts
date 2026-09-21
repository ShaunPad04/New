/**
 * Runtime configuration.
 *
 * Every integration in this system is opt-in. Nothing is stubbed with fake
 * data: if a capability is not configured, the code path that needs it
 * reports that it is unconfigured and stops. See `docs/INTEGRITY.md`.
 */

function str(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length > 0 ? v.trim() : undefined;
}

export const env = {
  /** Absolute or project-relative path to the SQLite database file. */
  databaseFile: str("DATABASE_FILE") ?? "data/lead-engine.db",

  /** Web search provider used by the discovery engine. */
  search: {
    provider: str("SEARCH_PROVIDER"), // "serper" | "brave" | "tavily"
    apiKey: str("SEARCH_API_KEY"),
  },

  /** Anthropic API, used for evidence extraction and outreach drafting. */
  anthropic: {
    apiKey: str("ANTHROPIC_API_KEY"),
    model: str("ANTHROPIC_MODEL") ?? "claude-opus-5",
  },

  /** Where high-intent notifications are posted. */
  notifications: {
    webhookUrl: str("NOTIFY_WEBHOOK_URL"),
    email: str("NOTIFY_EMAIL"),
  },

  /** Shared secret required by /api/cron/* so schedulers can authenticate. */
  cronSecret: str("CRON_SECRET"),

  /** Contact address advertised to the sites this engine fetches. */
  crawlerContact: str("CRAWLER_CONTACT") ?? "contact@blacklineagency.co.uk",
} as const;

export type Configured<T> =
  | { configured: true; value: T }
  | { configured: false; reason: string };

export function requireSearch(): Configured<{ provider: string; apiKey: string }> {
  const { provider, apiKey } = env.search;
  if (!provider) {
    return { configured: false, reason: "SEARCH_PROVIDER is not set. Discovery cannot run without a search provider." };
  }
  if (!apiKey) {
    return { configured: false, reason: `SEARCH_API_KEY is not set for provider "${provider}".` };
  }
  return { configured: true, value: { provider, apiKey } };
}

export function requireAnthropic(): Configured<{ apiKey: string; model: string }> {
  const { apiKey, model } = env.anthropic;
  if (!apiKey) {
    return { configured: false, reason: "ANTHROPIC_API_KEY is not set. Evidence extraction and outreach drafting are unavailable." };
  }
  return { configured: true, value: { apiKey, model } };
}
