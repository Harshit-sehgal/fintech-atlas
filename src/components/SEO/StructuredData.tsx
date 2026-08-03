import { seoCompanies, seoCompaniesCount } from "@/data/seo-companies";
import { canonicalUrl } from "@/lib/canonical-url";
import { sanitiseJsonLd } from "./schemas";

// ItemList for companies directory. Google's Carousel/ItemList docs require the
// `url` to be the canonical URL of the item's detail page. We use
// trailingSlash:true in next.config, so the canonical form of each company
// page is `/companies/<slug>/` (with trailing slash, matching the page's
// canonical link and sitemap entry). Pinning the structured-data URL to the
// canonical form stops Google Search Console from signalling the urls as
// duplicates of the trailing-slash canonical.
//
// Organization and WebSite schemas are emitted once in the root layout
// (StructuredDataLite) — this page only adds the directory's ItemList to avoid
// emitting duplicate schemas on this route.
export const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "FinTech Companies Directory",
  numberOfItems: seoCompaniesCount,
  itemListElement: seoCompanies.map((company, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: canonicalUrl(`/companies/${company.slug}`),
    name: company.name,
  })),
};

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitiseJsonLd(itemListSchema) }}
    />
  );
}
