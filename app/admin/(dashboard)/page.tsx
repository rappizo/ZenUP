import { saveStoreSettingsAction } from "@/app/admin/actions";
import { formatCurrency, formatNumber } from "@/lib/format";
import { getDashboardSummary, getStoreSettings } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

type AdminDashboardPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const [summary, settings, params] = await Promise.all([
    getDashboardSummary(),
    getStoreSettings(),
    searchParams
  ]);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <p className="eyebrow">Dashboard</p>
        <h1>Keep the ZenUP storefront, formula content, and customer flow in sync.</h1>
        <p>
          This control center covers catalog status, order activity, customer growth, rewards, and
          key store settings for the United States market.
        </p>
      </div>

      {params.status === "settings-saved" ? (
        <p className="notice">Store settings were updated successfully.</p>
      ) : null}

      <div className="stats-grid">
        <div className="stat-card">
          <strong>{formatNumber(summary.activeProductCount)}</strong>
          <span>Active products</span>
        </div>
        <div className="stat-card">
          <strong>{formatCurrency(summary.paidRevenueCents)}</strong>
          <span>Paid revenue</span>
        </div>
        <div className="stat-card">
          <strong>{formatNumber(summary.customerCount)}</strong>
          <span>Customers</span>
        </div>
        <div className="stat-card">
          <strong>{formatNumber(summary.pointsIssued)}</strong>
          <span>Points issued</span>
        </div>
        <div className="stat-card">
          <strong>{formatNumber(summary.completedOmbClaimsToday)}</strong>
          <span>Completed OMB claims today (Los Angeles)</span>
        </div>
        <div className="stat-card">
          <strong>{formatNumber(summary.contactFormTodayCount)}</strong>
          <span>New contact forms today</span>
          <span>Unhandled: {formatNumber(summary.contactFormUnhandledCount)}</span>
        </div>
      </div>

      <div className="cards-2">
        <section className="admin-card">
          <h3>Low inventory watch</h3>
          <ul className="admin-list">
            {summary.lowInventoryProducts.map((product) => (
              <li key={product.id}>
                {product.name} <strong>{product.inventory}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section className="admin-card">
          <h3>Recent orders</h3>
          <ul className="admin-list">
            {summary.recentOrders.map((order) => (
              <li key={order.id}>
                {order.orderNumber} | {order.email} | {formatCurrency(order.totalCents)} | {order.status}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="admin-form">
        <h2>Store settings</h2>
        <form action={saveStoreSettingsAction}>
          <div className="admin-form__grid">
            <div className="field">
              <label htmlFor="shipping_region">Shipping region</label>
              <input
                id="shipping_region"
                name="shipping_region"
                defaultValue={settings.shipping_region || "United States only"}
              />
            </div>
            <div className="field">
              <label htmlFor="support_email">Support email</label>
              <input
                id="support_email"
                name="support_email"
                defaultValue={settings.support_email || siteConfig.supportEmail || ""}
              />
            </div>
            <div className="field">
              <label htmlFor="support_phone">Support phone</label>
              <input
                id="support_phone"
                name="support_phone"
                defaultValue={settings.support_phone || siteConfig.phone || ""}
              />
            </div>
            <div className="field">
              <label htmlFor="reward_rule">Reward rule</label>
              <input
                id="reward_rule"
                name="reward_rule"
                defaultValue={settings.reward_rule || "1 point per $1 spent"}
              />
            </div>
            <div className="field">
              <label htmlFor="stripe_mode">Stripe mode</label>
              <input
                id="stripe_mode"
                name="stripe_mode"
                defaultValue={settings.stripe_mode || "Add live Stripe keys to launch"}
              />
            </div>
          </div>
          <button type="submit" className="button button--primary">
            Save settings
          </button>
        </form>
      </section>
    </div>
  );
}
