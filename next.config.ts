import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Static export → emits a self-contained `out/` directory (HTML/CSS/JS +
  // everything under public/, incl. public/logos/*.svg). Hosted as plain
  // static files (e.g. python -m http.server out).
  output: "export",
  // GitHub Pages project sites build with NEXT_PUBLIC_BASE_PATH=/repo; root
  // deployments leave it unset. Next applies this to internal links/assets.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  // Keep Turbopack rooted at this app even when a parent directory contains
  // another package-lock.json. This makes builds deterministic in monorepos
  // and removes the workspace-root inference warning.
  turbopack: {
    root: process.cwd(),
  },
  // Emit /companies/<slug>/index.html (not <slug>.html) so plain static
  // hosts resolve trailing-slash URLs to a real index doc instead of a
  // directory listing.
  trailingSlash: true,
};
export default nextConfig;
