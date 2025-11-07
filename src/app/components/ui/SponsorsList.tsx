"use client";
import React, { useState, useEffect, useMemo } from "react";

export type Sponsor = {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  href?: string;
};

function pickRandomSponsors(list: Sponsor[], count = 3): Sponsor[] {
  // Deduplicate by id and pick a stable slice without mutating the input.
  // NOTE: Previously this function shuffled with Math.random(), which produced
  // different output between server and client and caused React hydration
  // mismatches. Return a deterministic selection (first N unique) instead.
  const unique = Array.from(new Map(list.map((s) => [s.id ?? s.name, s])).values());
  return unique.slice(0, Math.max(0, Math.min(count, unique.length)));
}

// Mock sponsors data - in a real app this would come from an API
const mockSponsors: Sponsor[] = [
  {
    id: "1",
    name: "TechCorp",
    description: "Leading technology solutions",
    logoUrl: "https://via.placeholder.com/40x40?text=TC",
    href: "https://techcorp.com"
  },
  {
    id: "2",
    name: "GameStudio",
    description: "Indie game development",
    logoUrl: "https://via.placeholder.com/40x40?text=GS",
    href: "https://gamestudio.com"
  },
  {
    id: "3",
    name: "CloudTech",
    description: "Cloud infrastructure services",
    logoUrl: "https://via.placeholder.com/40x40?text=CT",
    href: "https://cloudtech.com"
  },
  {
    id: "4",
    name: "DataFlow",
    description: "Big data analytics platform",
    logoUrl: "https://via.placeholder.com/40x40?text=DF",
    href: "https://dataflow.com"
  },
  {
    id: "5",
    name: "WebDesign Pro",
    description: "Professional web design",
    logoUrl: "https://via.placeholder.com/40x40?text=WD",
    href: "https://webdesignpro.com"
  },
  {
    id: "6",
    name: "AI Solutions",
    description: "Artificial intelligence tools",
    logoUrl: "https://via.placeholder.com/40x40?text=AI",
    href: "https://aisolutions.com"
  }
];

interface SponsorsListProps {
  sponsors?: Sponsor[];
  count?: number;
}

export function SponsorsList({ sponsors = mockSponsors, count = 3 }: SponsorsListProps) {
  // Choose a deterministic initial set for SSR, then reshuffle on the client
  const initialSelection = useMemo(() => pickRandomSponsors(sponsors, count), [sponsors, count]);
  const [randomSelection, setRandomSelection] = React.useState<Sponsor[]>(initialSelection);

  // Run only on client to reshuffle so each reload can show different sponsors
  React.useEffect(() => {
    // shuffle a fresh copy on the client
    const unique = Array.from(new Map(sponsors.map((s) => [s.id ?? s.name, s])).values());
    for (let i = unique.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unique[i], unique[j]] = [unique[j], unique[i]];
    }
    setRandomSelection(unique.slice(0, Math.max(0, Math.min(count, unique.length))));
  }, [sponsors, count]);

  return (
    <div className="rounded-2xl border border-white/20 bg-black/40 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Featured Sponsors</h3>
        <span className="text-[10px] uppercase tracking-widest text-indigo-300/80">Random {count}</span>
      </div>
      <ul className="space-y-3">
        {randomSelection.map((s: Sponsor) => (
          <li key={s.id} className="group">
            <a
              href={s.href ?? "#"}
              className="flex items-center gap-3 rounded-xl border border-white/10 p-3 transition hover:border-indigo-400/50 hover:bg-white/5"
            >
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10">
                {s.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.logoUrl} alt={s.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-white/70">
                    {s.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-white">{s.name}</div>
                <div className="truncate text-xs text-white/60">{s.description}</div>
              </div>
            </a>
          </li>
        ))}
        {randomSelection.length === 0 && (
          <li className="text-xs text-white/60">No sponsors found.</li>
        )}
      </ul>
    </div>
  );
}