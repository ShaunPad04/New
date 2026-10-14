/**
 * Office locations as Google Maps lists them, captured 10 September 2026.
 * Coordinates, opening hours and ratings are read straight off each Google
 * Business Profile; the review counts are the totals shown that day.
 * Paul Fox Lettings shares the Scunthorpe listing, so it is not repeated.
 */
export type OfficeHours = { days: string; time: string };

export type OfficeLocation = {
  slug: string;
  name: string;
  /** Short line used on the tab. */
  town: string;
  address: string[];
  phone: string;
  lat: number;
  lng: number;
  rating: number;
  reviews: number;
  hours: OfficeHours[];
  /** Google Maps place page. */
  mapsUrl: string;
  /** Office page on this site, or the external commercial site. */
  href: string;
};

const WEEKDAYS = { days: "Monday – Friday", time: "9:00 am – 5:00 pm" };
const SAT_ONE = { days: "Saturday", time: "9:00 am – 1:00 pm" };
const SAT_NOON = { days: "Saturday", time: "9:00 am – 12:00 pm" };
const SUNDAY = { days: "Sunday", time: "Closed" };

export const officeLocations: OfficeLocation[] = [
  {
    slug: "scunthorpe",
    name: "Scunthorpe",
    town: "Scunthorpe",
    address: ["29-31 Oswald Road", "Scunthorpe", "DN15 7PN"],
    phone: "01724 282868",
    lat: 53.5896326,
    lng: -0.6542106,
    rating: 4.4,
    reviews: 152,
    hours: [WEEKDAYS, SAT_ONE, SUNDAY],
    mapsUrl: "https://www.google.com/maps/place/Paul+Fox+Estate+Agents,+Scunthorpe/@53.5896326,-0.6542106,17z/data=!3m1!4b1!4m6!3m5!1s0x4878e51bea582829:0xc86cae1923d5b0e9!8m2!3d53.5896326!4d-0.6542106!16s%2Fg%2F11f3rg3vs_",
    href: "/office/scunthorpe",
  },
  {
    slug: "brigg",
    name: "Brigg",
    town: "Brigg",
    address: ["10 Market Place", "Brigg", "DN20 8ES"],
    phone: "01652 651777",
    lat: 53.552146,
    lng: -0.4926402,
    rating: 4.7,
    reviews: 71,
    hours: [WEEKDAYS, SAT_ONE, SUNDAY],
    mapsUrl: "https://www.google.com/maps/place/Paul+Fox+Estate+Agents,+Brigg/@53.552146,-0.4926402,17z/data=!3m1!4b1!4m6!3m5!1s0x4878f20fd999fbe5:0x219cfe28507ab473!8m2!3d53.552146!4d-0.4926402!16s%2Fg%2F1tfkf2v2",
    href: "/office/brigg",
  },
  {
    slug: "barton",
    name: "Barton-upon-Humber",
    town: "Barton",
    address: ["11 King Street", "Barton-upon-Humber", "DN18 5ER"],
    phone: "01652 635000",
    lat: 53.6841012,
    lng: -0.439466,
    rating: 4.1,
    reviews: 30,
    hours: [WEEKDAYS, SAT_ONE, SUNDAY],
    mapsUrl: "https://www.google.com/maps/place/Paul+Fox+Estate+Agents,+Barton-Upon-Humber/@53.6841012,-0.439466,17z/data=!3m1!4b1!4m6!3m5!1s0x4878eb1a27fb015f:0x4541520b55d9bb0e!8m2!3d53.6841012!4d-0.439466!16s%2Fg%2F1tn00r95",
    href: "/office/barton",
  },
  {
    slug: "epworth",
    name: "Epworth",
    town: "Epworth",
    address: ["15-17 High Street", "Epworth", "DN9 1EP"],
    phone: "01427 339100",
    lat: 53.5255216,
    lng: -0.8214406,
    rating: 4.8,
    reviews: 58,
    hours: [WEEKDAYS, SAT_NOON, SUNDAY],
    mapsUrl: "https://www.google.com/maps/place/Paul+Fox+Estate+Agents,+Epworth/@53.5255216,-0.8214406,17z/data=!3m1!4b1!4m6!3m5!1s0x487902847c6026ad:0x115c6ea5edcd83!8m2!3d53.5255216!4d-0.8214406!16s%2Fg%2F11ffrttzb8",
    href: "/office/epworth",
  },
  {
    slug: "gainsborough",
    name: "Gainsborough",
    town: "Gainsborough",
    address: ["Marshalls Yard", "Gainsborough", "DN21 2NA"],
    phone: "01427 339200",
    lat: 53.399253,
    lng: -0.7720675,
    rating: 4.7,
    reviews: 55,
    hours: [WEEKDAYS, SAT_NOON, SUNDAY],
    mapsUrl: "https://www.google.com/maps/place/Paul+Fox+Estate+Agents,+Gainsborough/@53.399253,-0.7720675,17z/data=!3m1!4b1!4m6!3m5!1s0x4878ffc1c7d37769:0xdc6871b15b6346fb!8m2!3d53.399253!4d-0.7720675!16s%2Fg%2F11smw4zdpf",
    href: "/office/gainsborough",
  },
  {
    slug: "commercial",
    name: "Commercial",
    town: "Commercial",
    address: ["Gainsborough Estates", "32 Oswald Road", "Scunthorpe", "DN15 7PQ"],
    phone: "01724 870520",
    lat: 53.5894532,
    lng: -0.6541282,
    rating: 3.7,
    reviews: 14,
    hours: [WEEKDAYS, { days: "Saturday", time: "Closed" }, SUNDAY],
    mapsUrl: "https://www.google.com/maps/place/Paul+Fox+Commercial/@53.5894532,-0.6541282,17z/data=!3m1!4b1!4m6!3m5!1s0x4878e51be9a3b529:0x7f26bd573a8c5f6d!8m2!3d53.5894532!4d-0.6541282!16s%2Fg%2F1tdmj_9r",
    href: "http://www.paulfoxcommercial.co.uk/",
  },
];

/** Keyless Google Maps embed centred on the office. */
export function embedUrl(o: OfficeLocation): string {
  return `https://maps.google.com/maps?q=${o.lat},${o.lng}&z=16&hl=en-GB&output=embed`;
}

/** Google Maps directions to the office from wherever the visitor is. */
export function directionsUrl(o: OfficeLocation): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${o.lat},${o.lng}`;
}

/**
 * Whether the office is open at a given instant, in UK time. Hours are
 * 9:00–17:00 on weekdays and Saturday morning to the closing hour parsed
 * from the listing; the check is deliberately conservative on bank holidays
 * (it does not know about them, so it treats them as ordinary days).
 */
export function isOpenNow(o: OfficeLocation, now = new Date()): boolean {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = get("weekday");
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  if (day === "Sun") return false;
  if (day === "Sat") {
    const sat = o.hours.find((h) => h.days === "Saturday");
    if (!sat || sat.time === "Closed") return false;
    const close = sat.time.includes("12:00") ? 12 * 60 : 13 * 60;
    return minutes >= 9 * 60 && minutes < close;
  }
  return minutes >= 9 * 60 && minutes < 17 * 60;
}

export const findUs = {
  eyebrow: "[ FIND US ]",
  heading: "find your nearest office",
  copy: "Six offices across North Lincolnshire, all computer linked — whichever branch you walk into can help with any property we market. Ratings and opening hours are as listed on Google.",
};
