import { hasTimes, type DayHours, type DayKey } from "./business";

export const DAYS: DayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
export const DAY_LABEL: Record<DayKey, string> = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday",
  friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};

/** Local wall-clock parts for a time zone, without a date library. */
export function localParts(now: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone, weekday: "long", hour: "2-digit", minute: "2-digit", hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
  const day = (parts.weekday as string).toLowerCase() as DayKey;
  const minutes = Number(parts.hour) % 24 * 60 + Number(parts.minute);
  return { day, minutes };
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export type OpenState = {
  isOpen: boolean;
  today: DayKey;
  label: string;
  short: string;
};

export function openState(week: Record<DayKey, DayHours>, timeZone: string, now = new Date()): OpenState {
  const { day, minutes } = localParts(now, timeZone);
  const today = week[day];
  if (hasTimes(today) && minutes >= toMin(today.open) && minutes < toMin(today.close)) {
    return { isOpen: true, today: day, label: `Open now · until ${today.close}`, short: `Open until ${today.close}` };
  }
  // Find the next opening slot, starting today (if before opening) then onwards.
  const start = DAYS.indexOf(day);
  for (let i = 0; i < 7; i++) {
    const key = DAYS[(start + i) % 7];
    const h = week[key];
    if (!hasTimes(h)) continue;
    if (i === 0 && minutes >= toMin(h.open)) continue; // already closed today
    const when = i === 0 ? "today" : i === 1 ? "tomorrow" : DAY_LABEL[key];
    // An appointment-only day reads as such rather than "closed".
    const now = week[day] && !hasTimes(week[day]) ? "By appointment today" : "Closed";
    return { isOpen: false, today: day, label: `${now} · opens ${when} ${h.open}`, short: `Opens ${when} ${h.open}` };
  }
  return { isOpen: false, today: day, label: "Closed", short: "Closed" };
}

/** schema.org openingHoursSpecification */
export function openingHoursSpec(week: Record<DayKey, DayHours>) {
  return DAYS.flatMap((d) => {
    const h = week[d];
    return hasTimes(h) ? [{ "@type": "OpeningHoursSpecification", dayOfWeek: DAY_LABEL[d], opens: h.open, closes: h.close }] : [];
  });
}
