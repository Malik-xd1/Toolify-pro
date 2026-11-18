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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## QR File Transfer — infrastructure

The `qr-file-transfer` tool (`components/workbench/QrFileTransferWorkbench.tsx`, `utils/transfer/*`, `app/api/transfer/*`) needs:

| Piece | What ships now | Production recommendation |
|---|---|---|
| Signaling | HTTP polling routes (`/api/transfer/signal`), in-memory session store | Fine on a single `next start` server. For multiple instances or serverless, move the store to Redis. |
| STUN | Google public STUN (override with `STUN_URLS`) | Same |
| TURN relay | None unless configured. Without one, some strict NATs or corporate networks can't connect directly and fall back to cloud. | Run coturn with `use-auth-secret`, then set `TURN_URLS=turn:turn.example.com:3478,turns:turn.example.com:5349` and `TURN_SECRET=...`. Credentials are short-lived HMACs generated on the server. |
| Temporary storage (fallback) | Local disk at `os.tmpdir()/toolify-transfer`, deleted when the session is cancelled or expires (swept every 60 s) | Needs a persistent Node server. On Vercel or other serverless hosts (4.5 MB request limit, temporary filesystem), switch to S3/R2 presigned URLs with a lifecycle rule. |

Env vars: `TURN_URLS`, `TURN_SECRET` (or `TURN_USERNAME`/`TURN_CREDENTIAL`), `STUN_URLS`, `TRANSFER_CLOUD_MAX_MB` (default 100), `TRANSFER_CLOUD_DISABLED=1`.
