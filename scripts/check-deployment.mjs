const baseUrl = (process.env.DEPLOY_URL || "").trim().replace(/\/+$/, "");

if (!baseUrl) {
  console.error("Usage: DEPLOY_URL=https://your.production.domain npm run check:deployment");
  process.exit(1);
}

let parsedBaseUrl;
try {
  parsedBaseUrl = new URL(baseUrl);
} catch {
  console.error(`DEPLOY_URL is not a valid absolute URL: ${baseUrl}`);
  process.exit(1);
}

const allowHttp = process.env.ALLOW_HTTP_DEPLOYMENT_CHECK === "true";
if (parsedBaseUrl.protocol !== "https:" && !allowHttp) {
  console.error(`DEPLOY_URL must use HTTPS (set ALLOW_HTTP_DEPLOYMENT_CHECK=true only for local testing): ${baseUrl}`);
  process.exit(1);
}

const basePath = parsedBaseUrl.pathname.replace(/\/+$/, "");
const originUrl = `${parsedBaseUrl.origin}${basePath}`;

const routes = [
  "/",
  "/about/",
  "/companies/",
  "/companies/stripe/",
  "/categories/payments/",
  "/articles/",
  "/tools/calculator/",
  "/tools/calculators/",
  "/tools/matchmaker/",
  "/tools/remittance/",
  "/privacy/",
  "/terms/",
  "/robots.txt",
  "/sitemap.xml",
  "/feed.xml",
  "/sw.js",
  "/offline.html",
  "/.well-known/security.txt",
];

const requiredHeaders = [
  "content-security-policy",
  "strict-transport-security",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
  "cross-origin-opener-policy",
  "x-frame-options",
];

let failed = false;
const responses = new Map();

for (const route of routes) {
  const url = new URL(`${basePath}${route}`, `${parsedBaseUrl.origin}/`);
  try {
    const response = await fetch(url, { redirect: "follow" });
    const body = await response.text();
    responses.set(route, { response, body });
    if (response.status !== 200) {
      failed = true;
      console.error(`[FAIL] ${route} -> HTTP ${response.status}`);
    } else if (route.endsWith("/") && route !== "/.well-known/security.txt") {
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("text/html") || !/<html[\s>]/i.test(body) || !/<title[\s>]/i.test(body)) {
        failed = true;
        console.error(`[FAIL] ${route} -> expected an HTML document with a title`);
      } else {
        console.log(`[PASS] ${route} -> HTTP 200 (HTML)`);
      }
    } else {
      console.log(`[PASS] ${route} -> HTTP 200`);
    }
  } catch (error) {
    failed = true;
    console.error(`[FAIL] ${route} -> ${error.message}`);
  }
}

const homepage = responses.get("/")?.response;
if (homepage) {
  for (const header of requiredHeaders) {
    if (!homepage.headers.get(header)) {
      failed = true;
      console.error(`[FAIL] / missing ${header}`);
    }
  }
}

const robots = responses.get("/robots.txt")?.body;
const escapedOriginUrl = originUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
if (robots && !new RegExp(`^Sitemap:\\s*${escapedOriginUrl}/sitemap\\.xml$`, "m").test(robots)) {
  failed = true;
  console.error("[FAIL] robots.txt sitemap does not match DEPLOY_URL");
}

const sitemap = responses.get("/sitemap.xml")?.body;
if (sitemap && !sitemap.includes(`${originUrl}/sitemap-0.xml`)) {
  failed = true;
  console.error("[FAIL] sitemap.xml does not reference the deployment origin");
}

const feed = responses.get("/feed.xml")?.body;
if (feed && (!feed.includes("<rss") || !feed.includes("<channel>"))) {
  failed = true;
  console.error("[FAIL] feed.xml is not a valid RSS channel");
}

const serviceWorker = responses.get("/sw.js")?.body;
if (serviceWorker && !serviceWorker.includes("addEventListener")) {
  failed = true;
  console.error("[FAIL] sw.js is not a service worker script");
}

const offline = responses.get("/offline.html")?.body;
if (offline && !offline.includes("You’re offline")) {
  failed = true;
  console.error("[FAIL] offline.html is missing its offline fallback content");
}

const security = responses.get("/.well-known/security.txt")?.body;
if (security && (!/^Contact:\s+\S+/m.test(security) || !/^Policy:\s+\S+/m.test(security))) {
  failed = true;
  console.error("[FAIL] security.txt is missing Contact or Policy");
}

if (failed) {
  console.error("\nDeployment verification failed.");
  process.exit(1);
}

console.log("\nDeployment verification passed.");
