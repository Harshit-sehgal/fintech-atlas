# Static hosting — provider notes

FinTech Atlas builds to `out/` (`next build` with `output: "export"`). Any static
host works. Apply the generated `out/_headers` (CSP, HSTS, etc.) and serve
`public/.well-known/security.txt`.

## Common providers

| Provider | Notes |
|----------|--------|
| **Netlify** | Publish directory `out`. `_headers` is picked up automatically. Set `SITE_URL` in build env. |
| **Cloudflare Pages** | Build command `npm run build`, output `out`. Map `_headers` via Pages Headers or `_headers` support. |
| **GitHub Pages** | Upload `out/` (Actions recommended). Configure custom domain + HTTPS. Headers need Pages advanced config or a CDN in front. |
| **Vercel** | Can host the static export; prefer configuring headers in `vercel.json` from the generated CSP if `_headers` is not applied. |
| **S3 + CloudFront** | Sync `out/` to the bucket; attach response headers policy for CSP/HSTS. |

## Required build environment

```bash
SITE_URL=https://your.production.domain npm run build
```

Optional:

```bash
NEXT_PUBLIC_ANALYTICS_DOMAIN=your.plausible.site.id
NEXT_PUBLIC_WAITLIST_ENDPOINT=https://formspree.io/f/...
```

## Rollback

Keep the previous `out/` artifact (CI artifact retention or object-storage
versioning). Redeploy the prior artifact to roll back. See
[`docs/incident-runbook.md`](../incident-runbook.md).
