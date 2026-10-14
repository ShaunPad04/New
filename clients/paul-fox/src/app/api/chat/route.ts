import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/assistant";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-opus-5";
const MAX_TURNS = 20;
const MAX_CHARS = 2000;

type Turn = { role: "user" | "assistant"; content: string };

function isTurn(v: unknown): v is Turn {
  if (!v || typeof v !== "object") return false;
  const t = v as Record<string, unknown>;
  return (t.role === "user" || t.role === "assistant") && typeof t.content === "string" && t.content.trim().length > 0;
}

// Built once per server instance; the content it reads is static.
let systemPrompt: string | undefined;

/**
 * Streams the assistant's reply as plain text. Returns 503 when no API key
 * is configured so the widget can fall back to the phone number instead of
 * pretending to think.
 */
export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "assistant_offline" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || !raw.every(isTurn)) {
    return Response.json({ error: "bad_messages" }, { status: 400 });
  }

  // Keep the last N turns, trim each, and make sure the thread ends with the
  // visitor's message.
  const messages = raw
    .slice(-MAX_TURNS)
    .map((t) => ({ role: t.role, content: t.content.slice(0, MAX_CHARS) }));
  if (messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "bad_messages" }, { status: 400 });
  }

  systemPrompt ??= buildSystemPrompt();
  const client = new Anthropic({ apiKey });

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on("text", (delta) => controller.enqueue(encoder.encode(delta)));
      stream
        .finalMessage()
        .then(() => controller.close())
        .catch((err: unknown) => {
          console.error("[chat] stream failed", err);
          controller.error(err);
        });
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
