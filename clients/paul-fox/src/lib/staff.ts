/**
 * Staff profiles, captured from paul-fox.com/our-staff and the individual
 * profile pages. Image paths are relative to the WordPress uploads folder.
 */
import staff from "@/data/staff.json";

export type StaffMember = {
  slug: string;
  name: string;
  short: string;
  role: string;
  image: string;
  phone: string;
  email: string;
  tags: string[];
  office: string;
  bio: string[];
};

export const allStaff: StaffMember[] = staff as StaffMember[];

export function getStaff(slug: string): StaffMember | undefined {
  return allStaff.find((s) => s.slug === slug);
}

/** Look up several members by slug, keeping the requested order. */
export function staffBySlugs(slugs: string[]): StaffMember[] {
  return slugs.map(getStaff).filter((s): s is StaffMember => Boolean(s));
}

export function staffByTag(tag: string): StaffMember[] {
  return allStaff.filter((s) => s.tags.includes(tag));
}
