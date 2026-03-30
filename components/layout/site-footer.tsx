import Link from "next/link";
import { getStoreSettings } from "@/lib/queries";
import { resolveStorefrontContact, siteConfig } from "@/lib/site-config";
import { Logo } from "@/components/brand/logo";

export async function SiteFooter() {
  const settings = await getStoreSettings();
  const contact = resolveStorefrontContact(settings);

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo />
          <p>
            Professional NAD+ nutrition designed around Nicotinamide Riboside, Quercetin
            Phytosome, Resveratrol, and CoQ10 for a clearer daily routine.
          </p>
          <div className="site-footer__contact">
            {contact.supportEmail ? <span>{contact.supportEmail}</span> : null}
            {contact.phone ? <span>{contact.phone}</span> : null}
            <span>Ships within {contact.shippingRegion}</span>
          </div>
        </div>
        <div>
          <h3>Shop</h3>
          <ul className="footer-link-list">
            {siteConfig.footerLinks.shop.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Discover</h3>
          <ul className="footer-link-list">
            {siteConfig.footerLinks.discover.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="site-footer__note">
          <h3>Policies</h3>
          <ul className="footer-link-list">
            {siteConfig.footerLinks.policies.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <p>(c) 2026 ZenUP. All rights reserved.</p>
        <p>Secure checkout. Ships within 1 business day. 30-day support window.</p>
      </div>
    </footer>
  );
}
