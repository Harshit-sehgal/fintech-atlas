import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/shared-metadata";
import { WatchlistView } from "./watchlist-view";

export const metadata: Metadata = pageMetadata({
  pathname: "/radar/watchlist",
  title: "Radar Watchlist",
  description:
    "Track Indian fintech companies you care about on the FinTech Atlas Radar watchlist and revisit their regulatory intelligence profile.",
});

export default function RadarWatchlistPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Radar", href: "/radar" },
          { name: "Watchlist", href: "/radar/watchlist" },
        ]}
      />

      <header className="mt-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Watchlist
        </h1>
        <p className="mt-4 text-[var(--fg-dim)]">
          Companies you are following on Radar. This prototype stores the list in
          your browser; change alerts and multi-device sync are paid-tier
          features behind the validation gate.
        </p>
      </header>

      <WatchlistView />
    </div>
  );
}