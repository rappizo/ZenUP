import { redirect } from "next/navigation";
import { loginAction } from "@/app/admin/actions";
import { Logo } from "@/components/brand/logo";
import { isAdminAuthenticated, isAdminConfigReady } from "@/lib/admin-auth";

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const authenticated = await isAdminAuthenticated();
  const adminConfigReady = isAdminConfigReady();

  if (authenticated) {
    redirect("/admin");
  }

  const params = await searchParams;

  return (
    <section className="admin-login">
      <div className="admin-login__panel">
        <Logo href="/" />
        <div>
          <p className="eyebrow">Admin access</p>
          <h1>Manage products, orders, customers, rewards, and blog content.</h1>
          <p>
            Use the admin credentials from your environment variables to enter the ZenUP
            operations dashboard.
          </p>
        </div>
        {params.error === "1" ? <p className="notice">Invalid username or password.</p> : null}
        {params.error === "config" ? (
          <p className="notice">
            Admin login is disabled until the required environment variables are configured.
          </p>
        ) : null}
        {!adminConfigReady ? (
          <p className="notice">
            Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in your environment
            before using admin login.
          </p>
        ) : null}
        <form action={loginAction} className="contact-form">
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required />
          </div>
          <button type="submit" className="button button--primary">
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
}
