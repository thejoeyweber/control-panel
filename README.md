
# Control Panel

Control Panel is an AI-driven, just-in-time project management web app. It enables users to
intuitively progress their projects by suggesting adaptive "work chunks," surfacing contextually
relevant resources, and maintaining structured, AI-friendly project histories.

## Tech Stack

- **Frontend**: Next.js (App Router), Tailwind, Shadcn, Framer Motion
- **Backend**: Postgres, Supabase, Drizzle ORM, Server Actions
- **Auth**: Clerk
- **Payments**: Stripe
- **Analytics**: PostHog
- **Deployment**: Vercel
- **Orchestration**: n8n

## Prerequisites

- Next.js and Node.js installed locally
- A Supabase account for database hosting
- A Clerk account for authentication
- A Stripe account for payments
- A PostHog account for analytics (optional, if using analytics)

## Environment Variables

Set these in `.env.local`:

```
# Database
DATABASE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PORTAL_LINK=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

## Setup

1. **Install Dependencies**  
   ```bash
   npm install
   ```

2. **Start the Development Server**  
   ```bash
   npm run dev
   ```

3. **Database Migrations**  
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Auth & Services**  
   - Configure Clerk, Supabase, and Stripe accounts
   - Update `.env.local` with your keys

5. **Deployment**  
   - For Vercel or another platform, ensure environment variables are set.

## Usage

After running `npm run dev`, open [http://localhost:3000](http://localhost:3000) to view the app in your browser.