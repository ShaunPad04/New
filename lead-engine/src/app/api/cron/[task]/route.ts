import { getClient } from "@/lib/clients";
import { runDiscovery } from "@/lib/discovery/run";
import { leadsNeedingFollowUp } from "@/lib/db/leads";
import { buildWeeklyReport, reportToText } from "@/lib/report/weekly";
import { notify } from "@/lib/notify";
import { authoriseCron, json } from "@/lib/api";

/**
 * Scheduled work, driven by whatever scheduler the deployment already has
 * (Vercel cron, a systemd timer, GitHub Actions — see docs/SCHEDULING.md).
 * Nothing here invents its own background runtime.
 *
 *   POST /api/cron/morning   — search for new projects, jobs, agencies, expansion
 *   POST /api/cron/afternoon — re-check the high-priority sources
 *   POST /api/cron/weekly    — build and send the BlackLine lead report
 */
export async function POST(request: Request, ctx: { params: Promise<{ task: string }> }) {
  const auth = authoriseCron(request);
  if (!auth.ok) return json({ ok: false, error: auth.message }, auth.status);

  const { task } = await ctx.params;
  const client = getClient();

  switch (task) {
    case "morning": {
      const run = await runDiscovery({
        client,
        trigger: "schedule",
        sources: ["project", "job", "recruitment", "expansion", "public_demand"],
      });
      if (run.status !== "succeeded") {
        notify({
          clientId: client.id,
          kind: "run_failed",
          title: "Scheduled discovery did not complete",
          body: run.error ?? "The run finished with status " + run.status,
        });
      }
      return json({ ok: run.status === "succeeded", run });
    }

    case "afternoon": {
      const run = await runDiscovery({
        client,
        trigger: "schedule",
        sources: ["public_demand", "job"],
        maxPages: 20,
      });
      const followUps = leadsNeedingFollowUp(client.id, new Date().toISOString().slice(0, 10));
      if (followUps.length > 0) {
        notify({
          clientId: client.id,
          kind: "follow_up",
          title: `${followUps.length} lead${followUps.length === 1 ? "" : "s"} due for follow-up`,
          body: followUps.map((l) => `${l.company.name} (${l.status})`).join("\n"),
        });
      }
      return json({ ok: run.status === "succeeded", run, followUps: followUps.length });
    }

    case "weekly": {
      const report = buildWeeklyReport(client, 7);
      notify({
        clientId: client.id,
        kind: "report",
        title: `BlackLine lead report — ${report.newLeads} new, ${report.bookings.length} booked`,
        body: reportToText(report, client.name),
      });
      return json({ ok: true, report: { ...report, text: reportToText(report, client.name) } });
    }

    default:
      return json({ ok: false, error: `Unknown task "${task}". Use morning, afternoon or weekly.` }, 404);
  }
}
