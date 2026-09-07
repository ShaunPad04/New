import { site } from "@/lib/content";

/**
 * LEGAL CONTENT
 *
 * ─────────────────────────────────────────────────────────────────────
 * THIS IS NOT LEGAL ADVICE. It was written by describing, accurately,
 * what this website actually does — audited rather than assumed — and
 * it still needs a solicitor's eye before the site is indexed.
 *
 * The audit behind it (2026-09-07, all seven routes, real browser):
 *   - cookies set .......... 0
 *   - localStorage ......... 0 keys
 *   - sessionStorage ....... 0 keys
 *   - third-party hosts .... 0 (only the site's own origin is contacted)
 *   - analytics ............ none installed
 *   - embeds / iframes ..... none
 *   - fonts ................ self-hosted at build by next/font, so no
 *                            request ever reaches Google
 *
 * That is why there is no cookie banner: there is nothing to consent to.
 * If ANY of the above changes — an analytics script, a map embed, a
 * booking widget, a chat bubble — this file and the cookie section of
 * the privacy policy must change with it, and a consent mechanism
 * becomes legally required before that script may load.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * Details only the client can supply, and which a privacy notice is
 * incomplete without.
 *
 * UK GDPR Article 13 requires the identity AND contact details of the data
 * controller. An email address alone is thin; a postal address is what is
 * normally expected, and if Black Line Agency is a registered company its
 * number and registered office must appear. Separately, most UK organisations
 * processing personal data must register with the ICO and pay the data
 * protection fee — a criminal-adjacent civil penalty if missed.
 *
 * Wired into `pnpm verify`, so an indexable build cannot ship without them.
 */
export const LEGAL_DETAILS_VERIFIED = false;

/** Reviewed by a solicitor. Nothing here has been. */
export const LEGAL_REVIEWED = false;

/** Bumped by hand whenever the substance of either document changes. */
export const LEGAL_LAST_UPDATED = "7 September 2026";

export type LegalSection = {
  id: string;
  heading: string;
  /** Paragraphs. Plain strings — no markup is interpreted. */
  body: string[];
  /** Optional bullet list rendered under the paragraphs. */
  list?: string[];
};

export type LegalDocument = {
  slug: string;
  title: string;
  lede: string;
  sections: LegalSection[];
};

/* ============================================================
   PRIVACY POLICY
   ============================================================ */

export const privacyPolicy: LegalDocument = {
  slug: "privacy",
  title: "Privacy policy",
  lede: `How ${site.name} handles personal information, and what we do not do with it. Written to describe this website exactly as it behaves.`,
  sections: [
    {
      id: "who-we-are",
      heading: "Who we are",
      body: [
        `${site.name} is a web design and online marketing studio founded by Bradley Hoxha and Shaun Padley, operating in the United Kingdom. For the purposes of UK data protection law we are the data controller for the personal information described in this policy.`,
        `You can reach us at ${site.email} or on ${site.phone}. If you want anything in this policy explained, ask — a plain answer is quicker than a complaint.`,
      ],
    },
    {
      id: "what-we-collect",
      heading: "What we collect",
      body: [
        "Only what you type into the enquiry form. Nothing on this website collects information about you in the background.",
      ],
      list: [
        "Your name",
        "Your email address",
        "An approximate budget range, if you choose one — it is optional",
        "Whatever you write in the message field",
      ],
    },
    {
      id: "why",
      heading: "Why we hold it, and on what legal basis",
      body: [
        "We use your enquiry to reply to you, to prepare a quote, and to have the conversation you started. That is the whole of it.",
        "Our lawful basis is Article 6(1)(b) of the UK GDPR — taking steps at your request before entering into a contract — and, where you are enquiring on behalf of an organisation, Article 6(1)(f), our legitimate interest in responding to business enquiries. We do not rely on consent for this, which is why there is no tick-box: consent you cannot meaningfully refuse and still get a reply would not be valid consent.",
        "We will not add you to a mailing list off the back of an enquiry, and we will not send you marketing you did not ask for.",
      ],
    },
    {
      id: "who-sees-it",
      heading: "Who else sees it",
      body: [
        "Your enquiry is delivered to our inbox by Resend, an email delivery provider, acting as our processor. It passes through their systems in order to reach us and is not used by them for anything else.",
        "This website is hosted by Vercel. Like any web host, their infrastructure processes the request your browser makes in order to serve the page.",
        "We do not sell personal information, we do not share it with advertisers, and we do not trade it. Nobody else receives it unless the law requires us to hand it over.",
      ],
    },
    {
      id: "transfers",
      heading: "Where it goes",
      body: [
        "Both providers above may process data outside the United Kingdom, including in the United States. Where that happens, transfers are made under the safeguards those providers put in place — such as the UK Addendum to the EU Standard Contractual Clauses, or the UK Extension to the EU–US Data Privacy Framework.",
      ],
    },
    {
      id: "how-long",
      heading: "How long we keep it",
      body: [
        "Enquiries that do not lead to work are deleted within 12 months. Where we go on to work together, we keep the correspondence for as long as the relationship lasts and for six years afterwards, which is the period UK tax and contract law expects records to be available for.",
        "Ask us to delete an enquiry sooner and we will, unless we are required to keep it.",
      ],
    },
    {
      id: "cookies",
      heading: "Cookies and tracking",
      body: [
        "This website sets no cookies. It stores nothing in your browser's local storage or session storage. It contains no analytics, no advertising pixels, no session recording, no heatmaps and no embedded third-party content.",
        "Every asset — including the typefaces — is served from this site's own domain, so loading a page does not tell any other company that you visited. That is a deliberate design decision, and it is the reason you were not shown a cookie banner: under the Privacy and Electronic Communications Regulations, consent is needed to store or read information on your device, and this site does neither.",
        "If that ever changes, this section changes with it and you will be asked before anything non-essential loads.",
      ],
    },
    {
      id: "your-rights",
      heading: "Your rights",
      body: [
        "Under UK data protection law you can ask us for a copy of what we hold about you, ask us to correct it, ask us to delete it, ask us to restrict what we do with it, object to our processing, or ask for it in a portable format. There is no charge and we will respond within one month.",
        `Email ${site.email} and say what you want. We would rather sort it out directly, but if you are unhappy with how we have handled your information you have the right to complain to the Information Commissioner's Office at ico.org.uk, or on 0303 123 1113.`,
      ],
    },
    {
      id: "security",
      heading: "Security",
      body: [
        "Enquiries reach us over an encrypted connection and are held in a mailbox protected by two-factor authentication. No transmission over the internet can be promised to be perfectly secure, and we will not pretend otherwise — but we do not keep personal information anywhere it does not need to be, which is the most effective protection there is.",
      ],
    },
    {
      id: "children",
      heading: "Children",
      body: [
        "This is a business-to-business website and is not directed at children. We do not knowingly collect information about anyone under 18.",
      ],
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      body: [
        `We update this policy when what we do changes, not on a schedule. The date at the top of this page is the date of the current version.`,
      ],
    },
  ],
};

/* ============================================================
   TERMS
   ============================================================ */

export const termsOfUse: LegalDocument = {
  slug: "terms",
  title: "Terms of use",
  lede: `The terms on which you use this website. They are not the terms of any project — that is a separate written agreement.`,
  sections: [
    {
      id: "about",
      heading: "About these terms",
      body: [
        `This website is operated by ${site.name}. By using it you accept these terms. If you do not accept them, please do not use the site.`,
        "These terms cover the website only. If you engage us for work, that is governed by a separate written agreement setting out scope, price, timescales and ownership — nothing on this website replaces it or forms a contract on its own.",
      ],
    },
    {
      id: "not-an-offer",
      heading: "Prices and information on this site",
      body: [
        "The prices shown are starting points published in good faith to give you a sense of range. They are an invitation to discuss work, not a contractual offer, and they are not binding until we have agreed a written scope with you. Prices exclude VAT.",
        "We take care over everything published here, but we do not warrant that the site is free of errors or that any particular outcome will follow from working with us. Nothing on this site should be treated as professional advice for your specific situation.",
      ],
    },
    {
      id: "ip",
      heading: "Intellectual property",
      body: [
        `The design, code, text and images on this website are owned by ${site.name} or used with permission, and are protected by copyright. You may view, download and print pages for your own reference. You may not republish, sell, or systematically copy any part of this site without our written permission.`,
        "Third-party names, logos and trademarks shown on this site are the property of their owners. They appear to identify tools we work with, and their appearance does not imply any endorsement, partnership or affiliation.",
      ],
    },
    {
      id: "your-use",
      heading: "Acceptable use",
      body: [
        "Do not use this site unlawfully, do not attempt to gain unauthorised access to it, and do not use the enquiry form to send unsolicited advertising, malicious content, or anything defamatory or unlawful.",
      ],
    },
    {
      id: "links",
      heading: "Links to other sites",
      body: [
        "Where we link to work we have built or to a third-party website, we do not control what those sites publish and we are not responsible for their content or their privacy practices.",
      ],
    },
    {
      id: "liability",
      heading: "Liability",
      body: [
        "To the extent the law allows, we exclude liability for any loss arising from your use of this website, including indirect or consequential loss and loss of profit, revenue or data.",
        "Nothing in these terms limits or excludes our liability for death or personal injury caused by negligence, for fraud or fraudulent misrepresentation, or for anything else that cannot lawfully be limited. If you deal with us as a consumer, your statutory rights are unaffected.",
      ],
    },
    {
      id: "law",
      heading: "Governing law",
      body: [
        "These terms are governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction.",
      ],
    },
  ],
};

export const legalDocuments: LegalDocument[] = [privacyPolicy, termsOfUse];
