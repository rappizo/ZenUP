# ZenUP

Focused ZenUP brand website for a professional NAD+ supplement storefront, built with Next.js, Prisma, Postgres, and Stripe-ready checkout.

## Included in this phase

- English storefront pages: Home, Shop, Blog, Contact
- Single flagship product detail page for `ZenUP NAD+ Nicotinamide Riboside 1100mg`
- Customer accounts with order, rewards, and review visibility
- Product reviews with verified-buyer submission and admin moderation
- SMTP email configuration for contact forms and account emails
- Admin portal for products, orders, customers, rewards, blog posts, and email marketing
- Stripe checkout route and webhook handler
- SEO basics with article pages, sitemap, and robots

## Local setup

1. Copy `.env.example` to `.env`.
2. Fill in your database connection strings, admin credentials, and Stripe keys.
3. Install dependencies:

```bash
npm install
```

4. Point `SUPABASE_POOLER_6543_URL` and `SUPABASE_POOLER_5432_URL` to your Postgres database, then generate the schema and starter data:

```bash
npm run db:push
npm run db:seed
```

5. Start development:

```bash
npm run dev
```

## Notes

- Current checkout is restricted to the United States.
- Product images and blog/home assets are read from the local `images/` folders.
- `NEXT_PUBLIC_SITE_URL` can be set to your production domain; otherwise the app falls back to `http://localhost:3000`.
- When you provide more product photography, final pricing, and long-form landing page copy, the existing admin and storefront structure can be extended directly without rebuilding the core architecture.

## Vercel deployment

1. Add `SUPABASE_POOLER_6543_URL`, `SUPABASE_POOLER_5432_URL`, `NEXT_PUBLIC_SITE_URL`, Stripe variables, and admin credentials to your deployment environment.
2. Deploy the repository.

The repo includes [`vercel.json`](./vercel.json), so Vercel will automatically run:

```bash
npm run vercel-build
```

That command generates Prisma Client, runs `prisma db push`, and then builds the Next.js app.
