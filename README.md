This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Commerce configuration

Set these environment variables in `.env.local` and in the deployment environment:

- `MONGODB_URI` — MongoDB connection string. Transactions used by payment settlement require a replica set (including MongoDB Atlas).
- `JWT_SECRET` — long, random secret used to sign the HTTP-only session cookie.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — private Cloudinary upload credentials.
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` — Razorpay API credentials. The key ID is sent to the browser; the secret must remain server-only.
- `RAZORPAY_WEBHOOK_SECRET` — webhook signing secret configured in Razorpay.

Configure a Razorpay webhook to send `payment.captured` events to `/api/payments/razorpay-webhook`. The endpoint verifies Razorpay's raw-body signature before updating the order. Do not mark orders paid from browser callbacks alone.

Product creation and product-image uploads require a user whose database `role` is `ADMIN`. New registrations default to `USER`; provision the first administrator through a trusted database/admin process, never from a public registration form.

Product inventory is stored in `Product.qty`; product prices are entered in rupees and order monetary snapshots are stored as integer paise with `currency: "INR"`. Before deploying these schema changes to a database with existing orders, migrate old order totals/items and resolve duplicate carts per user before enabling the unique cart index.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
