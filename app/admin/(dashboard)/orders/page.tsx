import { updateOrderAction } from "@/app/admin/actions";
import { formatCurrency, formatDate } from "@/lib/format";
import { getOrders } from "@/lib/queries";

type AdminOrdersPageProps = {
  searchParams: Promise<{ status?: string }>;
};

function formatAddress(parts: Array<string | null>) {
  return parts.filter(Boolean).join(", ");
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const [orders, params] = await Promise.all([getOrders(), searchParams]);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <p className="eyebrow">Orders</p>
        <h1>Monitor payment, addresses, and fulfillment from one place.</h1>
        <p>
          Every completed Stripe checkout writes the customer, coupon, shipping, billing, and line
          item details into this workspace so fulfillment can start without extra lookups.
        </p>
      </div>

      {params.status ? <p className="notice">Order action completed: {params.status}.</p> : null}

      <div className="cards-2">
        {orders.map((order) => (
          <section key={order.id} className="admin-form">
            <div className="checkout-confirmation-form__header">
              <div>
                <p className="eyebrow">{order.orderNumber}</p>
                <h2>{formatCurrency(order.totalCents)}</h2>
              </div>
              <div className="stack-row">
                <span className="pill">{order.status}</span>
                <span className="pill">{order.fulfillmentStatus}</span>
              </div>
            </div>

            <p className="form-note">
              {order.email} · {formatDate(order.createdAt)}
            </p>

            {order.couponCode ? (
              <p className="form-note">
                Coupon {order.couponCode} saved {formatCurrency(order.discountCents)}
              </p>
            ) : null}

            <div className="cards-2">
              <section className="admin-card">
                <h3>Shipping</h3>
                <ul className="admin-list">
                  <li>{order.shippingName || "No shipping name"}</li>
                  <li>
                    {formatAddress([
                      order.shippingAddress1,
                      order.shippingAddress2,
                      order.shippingCity,
                      order.shippingState,
                      order.shippingPostalCode,
                      order.shippingCountry
                    ]) || "No shipping address"}
                  </li>
                </ul>
              </section>

              <section className="admin-card">
                <h3>Billing</h3>
                <ul className="admin-list">
                  <li>{order.billingName || "No billing name"}</li>
                  <li>
                    {formatAddress([
                      order.billingAddress1,
                      order.billingAddress2,
                      order.billingCity,
                      order.billingState,
                      order.billingPostalCode,
                      order.billingCountry
                    ]) || "No billing address"}
                  </li>
                </ul>
              </section>
            </div>

            <section className="admin-card">
              <h3>Items</h3>
              <ul className="admin-list">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} x {item.quantity} · {formatCurrency(item.lineTotalCents)}
                  </li>
                ))}
              </ul>
            </section>

            <form action={updateOrderAction}>
              <input type="hidden" name="id" value={order.id} />
              <div className="admin-form__grid">
                <div className="field">
                  <label>Status</label>
                  <select name="status" defaultValue={order.status}>
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="FULFILLED">FULFILLED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>
                <div className="field">
                  <label>Fulfillment</label>
                  <select name="fulfillmentStatus" defaultValue={order.fulfillmentStatus}>
                    <option value="UNFULFILLED">UNFULFILLED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Order notes</label>
                <textarea name="notes" defaultValue={order.notes ?? ""} />
              </div>
              <button type="submit" className="button button--primary">
                Update order
              </button>
            </form>
          </section>
        ))}
      </div>
    </div>
  );
}
