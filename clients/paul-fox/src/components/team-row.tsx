import { staffBySlugs } from "@/lib/staff";
import { Appear } from "./appear";
import { Button } from "./button";
import { StaffCard } from "./staff-card";

type Props = { eyebrow?: string; title: string; slugs: string[]; copy?: string };

/** A row of staff cards for one office or department, with a link to everyone. */
export function TeamRow({ eyebrow = "[ MEET THE TEAM ]", title, slugs, copy }: Props) {
  const members = staffBySlugs(slugs);
  if (!members.length) return null;
  return (
    <section className="section">
      <div className="container flex flex-col gap-10">
        <div className="flex flex-col gap-5 tablet:flex-row tablet:items-end tablet:justify-between">
          <div className="flex flex-col gap-3 tablet:max-w-[560px]">
            <Appear>
              <p className="caption2">{eyebrow}</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">{title}</h2>
            </Appear>
            {copy && (
              <Appear delay={0.2}>
                <p className="body-sm">{copy}</p>
              </Appear>
            )}
          </div>
          <Appear delay={0.2}>
            <Button label="Show all staff" href="/our-staff" />
          </Appear>
        </div>
        <Appear delay={0.3} className="grid grid-cols-2 gap-5 tablet:grid-cols-3 desktop:grid-cols-4">
          {members.map((m, i) => (
            <StaffCard key={m.slug} member={m} index={i} />
          ))}
        </Appear>
      </div>
    </section>
  );
}
