import { ClearCartOnLoad } from "@/components/cart/clear-cart-on-load";
import { ButtonLink } from "@/components/ui/button-link";

export default function CheckoutSuccessPage() {
  return (
    <section className="section">
      <div className="container empty-state">
        <ClearCartOnLoad />
        <p className="eyebrow">Checkout complete</p>
        <h1>Your order has been received.</h1>
        <p>
          Thank you for shopping with ZenUP. Your checkout was completed successfully and we will
          begin preparing your order.
        </p>
        <div className="stack-row">
          <ButtonLink href="/shop" variant="primary">
            Continue shopping
          </ButtonLink>
          <ButtonLink href="/blog" variant="secondary">
            Read the blog
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
