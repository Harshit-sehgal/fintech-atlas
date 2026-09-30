import type { Metadata } from "next";
import BookmarksPageClient from "./bookmarks-client";
import { pageMetadata } from "@/lib/shared-metadata";

const description =
  "Your saved FinTech company profiles and glossary terms, stored locally in your browser. Build a personal FinTech knowledge base.";

export const metadata: Metadata = {
  ...pageMetadata({
    pathname: "/bookmarks",
    title: "Saved Items & Bookmarks",
    description,
  }),
  robots: { index: false, follow: false },
};

export default function BookmarksPage() {
  return <BookmarksPageClient />;
}
