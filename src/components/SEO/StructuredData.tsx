import { seoCompanies, seoCompaniesCount } from "@/data/seo-companies";
import { SITE_URL } from "@/lib/site-config";
import {
  organizationSchema,
  websiteSchema,
  sanitiseJsonLd,
} from "./schemas";

// ItemList for companies directory. Google's Carousel/ItemList docs require the
// `url` to be the canonical URL of the item's detail page. We use
// trailingSlash:true in next.config, so the canonical form of each company
// page is `/companies/<slug>/` (with trailing slash, matching the page's
// canonical link and sitemap entry). Pinning the structured-data URL to the
// canonical form stops Google Search Console from signalling the urls as
// duplicates of the trailing-slash canonical.
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "FinTech Companies Directory",
  numberOfItems: seoCompaniesCount,
  itemListElement: seoCompanies.map((company, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${SITE_URL}/companies/${company.slug}/`,
    name: company.name,
  })),
};

export default function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitiseJsonLd(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitiseJsonLd(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitiseJsonLd(itemListSchema) }}
      />
    </>
  );
}
