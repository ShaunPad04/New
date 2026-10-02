import { BRAND_MARK, nav, projects, site } from "@/lib/content";
import { SocialLinks } from "@/components/social-links";
import { HeaderBar } from "./header-bar";

export { HeaderSurfaceSentinel, HEADER_SENTINEL_ID } from "./header-bar";

/**
 * The header's server half: reads the copy here and hands the client bar only
 * what it shows, so content.ts (and the logo paths behind the socials) stay
 * on the server. Pages keep rendering `<Header />`.
 */
export function Header() {
  return (
    <HeaderBar
      nav={nav}
      site={{ name: site.name, email: site.email, phone: site.phone, phoneHref: site.phoneHref }}
      projectCount={projects.length}
      brandMark={BRAND_MARK}
      socials={<SocialLinks />}
    />
  );
}
