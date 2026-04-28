import { saveEmailSettingsAction } from "@/app/admin/actions";
import { getBrevoSettings } from "@/lib/brevo";
import { getStoreSettings } from "@/lib/queries";

type AdminEmailPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminEmailPage({ searchParams }: AdminEmailPageProps) {
  const [settings, params] = await Promise.all([getStoreSettings(), searchParams]);
  const brevoSettings = getBrevoSettings(settings);
  const emailEnabled = (settings.email_enabled || "false") === "true";
  const smtpReady = Boolean(
    settings.smtp_host &&
      settings.smtp_port &&
      settings.smtp_user &&
      settings.smtp_pass &&
      settings.email_from_address
  );
  const activeDeliveryProvider =
    !emailEnabled
      ? "Email disabled"
      : brevoSettings.apiKeyConfigured && brevoSettings.senderEmail
        ? "Brevo transactional"
        : smtpReady
          ? "Fallback SMTP"
          : "Not configured";

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <p className="eyebrow">Email</p>
        <h1>Configure ZenUP email delivery with Brevo first and SMTP only as a fallback.</h1>
        <p>
          Transactional emails now prioritize Brevo whenever a sender and API key are available.
          SMTP settings remain here as a backup path for contact, subscription, and account emails.
        </p>
        <div className="stack-row">
          <span className="pill">Active delivery: {activeDeliveryProvider}</span>
          <span className="pill">
            Brevo sender: {brevoSettings.senderEmail || "Not configured"}
          </span>
          <span className="pill">
            SMTP fallback: {smtpReady ? "Ready" : "Not ready"}
          </span>
        </div>
      </div>

      {params.status === "saved" ? <p className="notice">Email settings were saved.</p> : null}

      <section className="admin-form">
        <h2>Email delivery settings</h2>
        <p className="form-note">
          Brevo sender details are managed on the Email Marketing page. The values saved here still
          provide the default from address and the SMTP fallback path if Brevo transactional delivery
          is unavailable.
        </p>
        <form action={saveEmailSettingsAction}>
          <div className="admin-form__grid">
            <label className="field field--checkbox">
              <input
                type="checkbox"
                name="email_enabled"
                defaultChecked={(settings.email_enabled || "false") === "true"}
              />
              Enable email sending
            </label>
            <label className="field field--checkbox">
              <input
                type="checkbox"
                name="smtp_secure"
                defaultChecked={(settings.smtp_secure || "false") === "true"}
              />
              Use secure SMTP
            </label>
            <div className="field">
              <label htmlFor="smtp_host">SMTP host</label>
              <input id="smtp_host" name="smtp_host" defaultValue={settings.smtp_host || ""} />
            </div>
            <div className="field">
              <label htmlFor="smtp_port">SMTP port</label>
              <input id="smtp_port" name="smtp_port" defaultValue={settings.smtp_port || "587"} />
            </div>
            <div className="field">
              <label htmlFor="smtp_user">SMTP username</label>
              <input id="smtp_user" name="smtp_user" defaultValue={settings.smtp_user || ""} />
            </div>
            <div className="field">
              <label htmlFor="smtp_pass">SMTP password</label>
              <input id="smtp_pass" name="smtp_pass" type="password" defaultValue={settings.smtp_pass || ""} />
            </div>
            <div className="field">
              <label htmlFor="email_from_name">From name</label>
              <input
                id="email_from_name"
                name="email_from_name"
                defaultValue={settings.email_from_name || "ZenUP"}
              />
            </div>
            <div className="field">
              <label htmlFor="email_from_address">From email</label>
              <input
                id="email_from_address"
                name="email_from_address"
                defaultValue={settings.email_from_address || ""}
              />
            </div>
            <div className="field">
              <label htmlFor="contact_recipient">Contact recipient</label>
              <input
                id="contact_recipient"
                name="contact_recipient"
                defaultValue={settings.contact_recipient || ""}
              />
            </div>
          </div>
          <button type="submit" className="button button--primary">
            Save email settings
          </button>
        </form>
      </section>
    </div>
  );
}
