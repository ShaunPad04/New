import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Services } from "@/components/services";
import { Listings } from "@/components/listings";
import { Testimonials } from "@/components/testimonials";
import { Features } from "@/components/features";
import { Team } from "@/components/team";
import { Faq } from "@/components/faq";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <main>
    <Hero />
    <About />
    <Services />
    <Listings />
    <Testimonials />
    <Features />
    <Team />
    <Faq />
    <Contact />
    </main>
  );
}
