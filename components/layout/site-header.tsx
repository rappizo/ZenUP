import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { getCartItems } from "@/lib/cart";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button-link";

export async function SiteHeader() {
  const [customer, cartItems] = await Promise.all([getCurrentCustomer(), getCartItems()]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const accountHref = customer ? "/account" : "/account/login";

  return (
    <>
      <div className="announcement-bar">
        <div className="container announcement-bar__inner">
          <div className="announcement-bar__copy">
            <p>United States shipping only. Professional NAD+ nutrition for consistent daily use.</p>
            <Link href="/contact">Need help reviewing the formula?</Link>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="container site-header__inner">
          <Logo />
          <nav className="site-nav" aria-label="Primary navigation">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={item.href === "/shop" ? "site-nav__link site-nav__link--featured" : "site-nav__link"}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="site-header__actions">
            <Link href={accountHref} className="site-header__text-link site-header__account-link">
              My Account
            </Link>
            <ButtonLink href="/cart" variant="primary">
              Cart{cartCount > 0 ? ` (${cartCount})` : ""}
            </ButtonLink>
          </div>
        </div>
      </header>
    </>
  );
}
