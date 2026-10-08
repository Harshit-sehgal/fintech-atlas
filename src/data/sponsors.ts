/**
 * Sponsors (T162).
 *
 * Ten labelled slots on the landing page. Add real, disclosed sponsors to this
 * array — up to {@link SPONSOR_SLOTS}. It is empty by default on purpose: we do
 * not fabricate sponsors or logos, and unfilled slots render as clearly
 * available placeholders that link to the services contact form.
 *
 * Sponsored links must carry `rel="sponsored"` (the component sets it) and are
 * disclosed on /affiliate-disclosure.
 */
export interface Sponsor {
  /** Display name. Required. */
  name: string;
  /** The sponsor's destination URL. */
  url: string;
  /** Optional one-line descriptor shown under the name. */
  tagline?: string;
  /** Optional logo image path under /public, e.g. "/sponsors/acme.svg". */
  logo?: string;
}

/** Total sponsor slots rendered on the site. */
export const SPONSOR_SLOTS = 10;

/** Add sponsors here (up to SPONSOR_SLOTS). */
export const sponsors: Sponsor[] = [];
