import { upload } from "@/lib/assets";
import type { StaffMember } from "@/lib/staff";
import { Button } from "./button";
import { MapPin } from "./icons";

export function StaffCard({ member, index }: { member: StaffMember; index?: number }) {
  return (
    <a href={`/our-staff/${member.slug}`} className="group flex flex-col gap-2">
      <div className="relative aspect-[0.85] overflow-clip rounded-lg bg-ink-50">
        <img
          src={upload(member.image)}
          alt={member.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-[var(--ease-hover)] group-hover:scale-[1.03]"
        />
        <div className="hover-strip absolute inset-x-0 bottom-0 flex items-center justify-between p-4 opacity-0 transition-opacity duration-[400ms] ease-[var(--ease-hover)] group-hover:opacity-100">
          <span className="body-sm rounded-[4px] bg-ink-50 px-2 py-1 !text-ink-900">view profile</span>
          <Button as="span" variant="icon" />
        </div>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-ink-50 px-4 py-2">
        <h3 className="h6">{member.name}</h3>
        {typeof index === "number" && <span className="caption">[{String(index + 1).padStart(2, "0")}]</span>}
      </div>
      <div className="flex flex-col gap-1 px-4">
        <p className="body-sm !text-ink-900">{member.role}</p>
        <p className="caption2 flex items-center gap-1">
          <MapPin size={12} /> {member.office}
        </p>
      </div>
    </a>
  );
}
