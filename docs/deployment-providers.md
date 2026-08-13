# Static hosting — provider notes

FinTech Atlas builds to `out/` (`next build` with `output: "export"`). Any static
host works. The CSP ships **per page** as a `<meta http-equiv="Content-Security-Policy">`
tag inside each HTML document (see [SECURITY_REVIEW.md](./SECURITY_REVIEW.md)), so
it applies even on hosts that ignore `_headers`. The generated `out/_headers`
carries the remaining host-level security headers (HSTS, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`, `COOP`, `X-Frame-Options: DENY`). Also
serve `public/.well-known/security.txt`.

## Common providers

| Provider | Notes |
|----------|--------|
| **Netlify** | Publish directory `out`. `_headers` is picked up automatically. Set `SITE_URL` in build env. |
| **Cloudflare Pages** | Build command `npm run build`, output `out`. Map `_headers` via Pages Headers or `_headers` support. |
| **GitHub Pages** | Upload `out/` (Actions recommended). Configure custom domain + HTTPS. CSP ships in the document (meta tag) automatically; only host-level headers (HSTS, `X-Frame-Options`, etc.) need `_headers` support or a CDN in front. |
| **Vercel** | Can host the static export; document CSP applies automatically (in-page); configure remaining headers in `vercel.json`. |
| **S3 + CloudFront** | Sync `out/` to the bucket; attach response headers policy for HSTS/`X-Frame-Options` (CSP already ships in-page). |

## Required build environment

Root deployment:

```bash
SITE_URL=https://your.production.domain npm run build
```

GitHub Pages project-site deployment (if you do not use a custom domain):

```bash
SITE_URL=https://YOUR_OWNER.github.io/REPOSITORY \\
NEXT_PUBLIC_BASE_PATH=/REPOSITORY \\
npm run build
```

The project-site base path is applied to Next.js routing and public assets;
`SITE_URL` must still be the publicly reachable canonical origin plus path.
A custom domain at the root remains the simpler SEO and operational choice.

Optional:

```bash
NEXT_PUBLIC_ANALYTICS_DOMAIN=your.plausible.site.id
NEXT_PUBLIC_WAITLIST_ENDPOINT=https://formspree.io/f/...
NEXT_PUBLIC_NEWSLETTER_FORM_ACTION=https://your-provider.example/subscribe
```

For the scheduled GitHub Actions uptime workflow, configure the non-secret
repository variable `DEPLOYMENT_URL` (not a build environment variable) with the
canonical HTTPS origin. The workflow skips safely until this variable exists;
when configured, it probes the homepage and key tool/article routes and opens an
idempotent issue if they fail. See [Goal 11 observability](production-readiness/goal-11-observability.md).

## Verification

The build runs a deterministic artifact gate. After publishing to a real host,
run the deployed-site smoke check against that exact origin:

```bash
DEPLOY_URL=https://your.production.domain npm run check:deployment
```

For a GitHub Pages project-site artifact, pass the same base path used during
build when checking a downloaded artifact:

```bash
ARTIFACT_DIR=out NEXT_PUBLIC_BASE_PATH=/REPOSITORY npm run check:artifact
```

It checks representative routes, HTTP status, the sitemap/robots relationship,
`feed.xml`, `sw.js`, `offline.html`, `security.txt`, and the required host security headers. HTTPS is required by
default. Project-site paths such as `https://user.github.io/repository` are
supported. Do not substitute the CI placeholder URL; the check is intended for
a real deployed origin.

## Rollback

Keep the previous `out/` artifact (CI artifact retention or object-storage
versioning). Redeploy the prior artifact to roll back, then rerun the deployment
smoke check. See [`docs/incident-runbook.md`](../incident-runbook.md).
