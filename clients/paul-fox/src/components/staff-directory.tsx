"use client";

import { useState } from "react";
import type { StaffMember } from "@/lib/staff";
import { StaffCard } from "./staff-card";

type Filter = { label: string; tag: string };

export function StaffDirectory({ staff, filters }: { staff: StaffMember[]; filters: Filter[] }) {
  const [tag, setTag] = useState("");
  const list = tag ? staff.filter((s) => s.tags.includes(tag)) : staff;
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by office">
        {filters.map((f) => (
          <button
            key={f.tag}
            type="button"
            role="tab"
            aria-selected={tag === f.tag}
            onClick={() => setTag(f.tag)}
            className={`caption2 h-8 rounded-[4px] px-3 transition-colors duration-300 ${tag === f.tag ? "bg-ink-900 !text-ink-50" : "bg-ink-50 !text-ink-900 hover:bg-ink-200"}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5 tablet:grid-cols-3 desktop:grid-cols-4">
        {list.map((m, i) => (
          <StaffCard key={m.slug} member={m} index={i} />
        ))}
      </div>
    </div>
  );
}
