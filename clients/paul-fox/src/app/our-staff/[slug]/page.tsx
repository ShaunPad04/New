import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allStaff, getStaff } from "@/lib/staff";
import { upload } from "@/lib/assets";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { MapPin } from "@/components/icons";
import { TeamRow } from "@/components/team-row";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allStaff.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = getStaff(slug);
  if (!m) return {};
  return { title: `${m.name} — ${m.role}`, description: m.bio[0] };
}

export default async function StaffProfile({ params }: Props) {
  const { slug } = await params;
  const m = getStaff(slug);
  if (!m) notFound();
  const colleagues = allStaff.filter((s) => s.slug !== m.slug && s.office === m.office).slice(0, 4);
  const officeSlug = m.office.toLowerCase();

  return (
    <main>
      <section className="section">
        <div className="container flex flex-col gap-10 tablet:flex-row">
          <Appear onMount className="tablet:w-[460px]">
            <img src={upload(m.image)} alt={m.name} className="aspect-[0.85] w-full rounded-lg object-cover" fetchPriority="high" />
          </Appear>
          <div className="flex flex-1 flex-col gap-5">
            <Appear onMount>
              <p className="caption2">[ MEET {m.short.toUpperCase()} ]</p>
            </Appear>
            <Appear onMount delay={0.1}>
              <h1 className="h1">{m.name}</h1>
            </Appear>
            <Appear onMount delay={0.2}>
              <p className="body-lg !text-ink-900">{m.role}</p>
            </Appear>
            <Appear onMount delay={0.25}>
              <a href={`/office/${officeSlug}`} className="caption2 flex items-center gap-1 hover:!text-ink-900">
                <MapPin size={12} /> {m.office} office
              </a>
            </Appear>
            <div className="flex flex-col gap-4 border-t border-ink-200 pt-5">
              {m.bio.map((p, i) => (
                <Appear key={i} onMount delay={0.3 + i * 0.1}>
                  <p className="body">{p}</p>
                </Appear>
              ))}
            </div>
            <Appear onMount delay={0.4} className="flex flex-col gap-3 rounded-lg bg-ink-50 p-5">
              <p className="caption2">[ CONTACT ]</p>
              <div className="flex items-center justify-between border-b border-ink-200 pb-2">
                <span className="caption2">TELEPHONE</span>
                <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="body-sm !text-ink-900">
                  {m.phone}
                </a>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="caption2">EMAIL</span>
                <a href={`mailto:${m.email}`} className="body-sm !text-ink-900">
                  {m.email}
                </a>
              </div>
              <div className="flex flex-wrap gap-2.5 pt-2">
                <Button label="Book a free valuation" href="/valuation-request" />
                <Button label="All staff" href="/our-staff" variant="secondary" />
              </div>
            </Appear>
          </div>
        </div>
      </section>
      {colleagues.length > 0 && (
        <TeamRow eyebrow={`[ ${m.office.toUpperCase()} ]`} title={`also at ${m.office.toLowerCase()}`} slugs={colleagues.map((c) => c.slug)} />
      )}
    </main>
  );
}
