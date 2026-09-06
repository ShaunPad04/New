import { Reveal } from "@/components/reveal";
import { services } from "@/lib/content";

/** Buying, selling, part exchange and shipping — all verified from their own listings. */
export function Services() {
  return (
    <section className="border-t border-obsidian-line bg-obsidian py-24 sm:py-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <Reveal>
          <div className="rule-accent mb-8 w-24" />
          <p className="eyebrow mb-5">What we do</p>
          <h2 className="display-lg max-w-3xl text-bone">
            Buying, selling, part exchange.
          </h2>
        </Reveal>

        <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {services.map((service, i) => (
            <li key={service.title}>
              <Reveal delay={(i % 2) * 0.08}>
                <div className="bezel h-full">
                  <div className="bezel-core h-full p-8">
                    <h3 className="display-sm text-bone">{service.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                      {service.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
