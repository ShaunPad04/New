import { getClient } from "@/lib/clients";
import { buildWeeklyReport, reportToText } from "@/lib/report/weekly";
import { authoriseCron, json } from "@/lib/api";

export async function GET(request: Request) {
  const auth = authoriseCron(request);
  if (!auth.ok) return json({ ok: false, error: auth.message }, auth.status);

  const url = new URL(request.url);
  const days = Math.min(Math.max(Number(url.searchParams.get("days")) || 7, 1), 90);
  const client = getClient();
  const report = buildWeeklyReport(client, days);

  if (url.searchParams.get("format") === "text") {
    return new Response(reportToText(report, client.name), {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  return json({ ok: true, report });
}
