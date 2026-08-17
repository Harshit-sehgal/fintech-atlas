import type { Metadata } from "next";
import { AboutClient } from "./client";
import { pageMetadata } from "@/lib/shared-metadata";

const description =
  "How FinTech Atlas was built: methodology, data sources, and what this site does and doesn't claim to do.";

export const metadata: Metadata = pageMetadata({
  pathname: "/about",
  title: "About & Methodology",
  description,
});

export default function AboutPage() {
  return <AboutClient />;
}