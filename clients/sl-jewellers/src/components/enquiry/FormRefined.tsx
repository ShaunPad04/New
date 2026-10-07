"use client";

import type { FormEvent } from "react";
import { BUSINESS } from "@/lib/content";
import { useEnquiry } from "./useEnquiry";
import { Choice, Consent, Float, Guards, PhotoDrop, Picked, REPLIES, SUBJECTS, SendButton, Sent, ServerError } from "./parts";

/**
 * Form B, "One page, refined" (round 7, 7 Oct 2026; after 21st's floating-label fields and
 * file dropzones): everything on one page in four numbered sections. The subject is a row of
 * pills, labels sit in the fields and lift as you type, each field checks itself when you
 * leave it (a gold tick when it is right), photos drop into a dropzone with thumbnails, the
 * reply method is a segmented control and consent a switch.
 */
export default function FormRefined() {
  const e = useEnquiry();
  if (e.status === "success") return <Sent e={e} />;
  const v = e.values;
  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    await e.submit();
  };
  return (
    <form className="efb" onSubmit={onSubmit} noValidate>
      <section className="efb-sec">
        <h2 className="efb-h"><span className="tnum">01</span> What is it about?</h2>
        <Choice name="type" legend="Choose one" options={SUBJECTS} value={v.type} onChange={(x) => e.set("type", x)} error={e.errors.type} variant="pills" />
      </section>

      <section className="efb-sec">
        <h2 className="efb-h"><span className="tnum">02</span> The piece</h2>
        <Picked e={e} />
        <Float label="Which piece?" optional value={v.item} onChange={(x) => e.set("item", x)} maxLength={600} hint="A name, a reference or a weight is enough." />
        <Float label="Your message" textarea value={v.message} onChange={(x) => e.set("message", x)} onBlur={() => v.message && e.check(["message"])} error={e.errors.message} maxLength={3000} hint="What are you after, or what have you got? Carat, weight and size help if you know them." />
        <PhotoDrop e={e} />
      </section>

      <section className="efb-sec">
        <h2 className="efb-h"><span className="tnum">03</span> Your details</h2>
        <Float label="Your name" value={v.name} onChange={(x) => e.set("name", x)} onBlur={() => v.name && e.check(["name"])} error={e.errors.name} autoComplete="name" />
        <div className="efa-two">
          <Float label="Phone" type="tel" inputMode="tel" value={v.phone} onChange={(x) => e.set("phone", x)} onBlur={() => v.phone && e.check(["phone"])} error={e.errors.phone} autoComplete="tel" />
          <Float label="Email" type="email" inputMode="email" value={v.email} onChange={(x) => e.set("email", x)} onBlur={() => v.email && e.check(["email"])} error={e.errors.email} autoComplete="email" />
        </div>
      </section>

      <section className="efb-sec">
        <h2 className="efb-h"><span className="tnum">04</span> How should we reply?</h2>
        <Choice name="contact" legend="We will reply by" options={REPLIES} value={v.contact} onChange={(x) => e.set("contact", x)} error={e.errors.contact} variant="seg" />
        <Consent e={e} />
        <Guards e={e} />
      </section>

      <ServerError e={e} />
      <div className="efb-foot">
        <SendButton e={e} />
        <span className="efb-or">
          Or call <a href={`tel:${BUSINESS.phone.e164}`} className="tnum">{BUSINESS.phone.display}</a>
        </span>
      </div>
    </form>
  );
}
