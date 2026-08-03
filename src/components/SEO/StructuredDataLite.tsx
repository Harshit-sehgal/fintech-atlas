import {
  organizationSchema,
  websiteSchema,
  sanitiseJsonLd,
} from "./schemas";

export default function StructuredDataLite() {
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
    </>
  );
}
