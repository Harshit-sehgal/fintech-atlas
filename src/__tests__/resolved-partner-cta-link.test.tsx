import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { ResolvedPartnerCtaLink } from "@/components/ui/resolved-partner-cta-link";
import { COMMERCIAL_DISCLOSURE } from "@/lib/commercial-disclosure";

const base = {
  href: "https://example.com/?utm_source=fintechatlas",
  label: "Visit Example",
  companySlug: "example",
  placement: "article-cta",
  relationship: "none",
  trackingId: "example",
};

describe("ResolvedPartnerCtaLink", () => {
  it("renders the resolved anchor with safe outbound rel when non-commercial", () => {
    const html = renderToString(
      <ResolvedPartnerCtaLink {...base} rel="noopener noreferrer" isCommercial={false} />,
    );
    expect(html).toContain(`href="${base.href}"`);
    expect(html).toContain('rel="noopener noreferrer"');
    // SSR splits adjacent text nodes with comment markers — assert parts.
    expect(html).toContain("Visit Example");
    expect(html).toContain("↗");
    // No earnings disclosure while the offer is not commercial.
    expect(html).not.toContain(COMMERCIAL_DISCLOSURE.slice(0, 40));
  });

  it("qualifies sponsored links and shows the disclosure when commercial", () => {
    const html = renderToString(
      <ResolvedPartnerCtaLink
        {...base}
        relationship="affiliate"
        rel="sponsored noopener noreferrer"
        isCommercial={true}
      />,
    );
    expect(html).toContain('rel="sponsored noopener noreferrer"');
    expect(html).toContain(COMMERCIAL_DISCLOSURE.slice(0, 40));
  });

  it("applies the variant class and className override", () => {
    const html = renderToString(
      <ResolvedPartnerCtaLink
        {...base}
        rel="noopener noreferrer"
        isCommercial={false}
        variant="compact"
        className="text-xs"
      />,
    );
    expect(html).toContain("rounded-lg border");
    expect(html).toContain("text-xs");
  });
});
