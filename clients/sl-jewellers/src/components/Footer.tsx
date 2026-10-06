import Link from "next/link";
import { BUSINESS } from "@/lib/content";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  const b = BUSINESS;
  const year = new Date().getFullYear();
  return (
    <footer className="on-graphite border-t border-line-dark">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo variant="full" className="w-36" alt="S&L Jewellers" />
          <p className="mt-4 max-w-[34ch] text-wall">{b.tagline}</p>
          <p className="mt-3 text-sm text-wall">{b.notAffiliated}</p>
          <SocialLinks variant="footer" className="mt-5" />
        </div>

        <div>
          <p className="eyebrow">The shop</p>
          <address className="mt-3 not-italic leading-relaxed">
            {b.address.street}
            <br />
            {b.address.town}
            <br />
            {b.address.postcode}
          </address>
          <a href={b.social.google.directionsUrl} target="_blank" rel="noopener" className="tap mt-1 inline-flex text-sm font-semibold text-paper">
            Get directions
          </a>
          <br />
          <Link href="/#visit" className="tap mt-1 inline-flex text-sm font-semibold text-paper">
            Opening hours
          </Link>
        </div>

        <div>
          <p className="eyebrow">Get in touch</p>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li>
              <a href={`tel:${b.phone.e164}`} className="tap tnum">{b.phone.display}</a>
            </li>
            <li>
              <a href={`mailto:${b.email}`} className="tap">{b.email}</a>
            </li>
            <li>
              <Link href="/enquiry" className="tap">Make an enquiry</Link>
            </li>
            <li>
              <Link href="/privacy" className="tap">Privacy policy</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line-dark">
        <div className="wrap flex flex-col gap-2 py-5 text-xs text-wall md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {b.legalName}. Company no. {b.companyNumber}. Registered office: {b.registeredOffice}.
          </p>
          <p>
            Cookieless analytics only. No cookie banner needed. Site by{" "}
            <a href="https://blacklineagency.co.uk" rel="noopener" className="tap">
              Black Line Agency
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
