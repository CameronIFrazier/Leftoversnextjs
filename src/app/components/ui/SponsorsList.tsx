"use client";
import React, { useState, useEffect, useMemo } from "react";

export type Sponsor = {
  id: string;
  name: string;
  description: string;
  href?: string;
};

const mockSponsors: Sponsor[] = [
  { id: "1", name: "TechCorp", description: "Leading technology solutions", href: "https://techcorp.com" },
  { id: "2", name: "GameStudio", description: "Indie game development", href: "https://gamestudio.com" },
  { id: "3", name: "CloudTech", description: "Cloud infrastructure services", href: "https://cloudtech.com" },
  { id: "4", name: "DataFlow", description: "Big data analytics platform", href: "https://dataflow.com" },
  { id: "5", name: "WebDesign Pro", description: "Professional web design", href: "https://webdesignpro.com" },
  { id: "6", name: "AI Solutions", description: "Artificial intelligence tools", href: "https://aisolutions.com" },
];
//force push

function pickRandomSponsors(list: Sponsor[], count = 3): Sponsor[] {
  const unique = Array.from(new Map(list.map((s) => [s.id, s])).values());
  return unique.slice(0, Math.max(0, Math.min(count, unique.length)));
}

export function SponsorsList({ sponsors = mockSponsors, count = 3 }) {
  const initialSelection = useMemo(() => pickRandomSponsors(sponsors, count), [sponsors, count]);
  const [randomSelection, setRandomSelection] = useState<Sponsor[]>(initialSelection);

  useEffect(() => {
    const unique = Array.from(new Map(sponsors.map((s) => [s.id, s])).values());
    setRandomSelection(unique.slice(0, Math.min(count, unique.length)));
  }, [sponsors, count]);

  return (
    <div className="rounded-2xl border border-white/20 bg-black/40 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Featured Sponsors</h3>
        
      </div>
      <ul className="space-y-3">
        {randomSelection.map((s) => (
          <li key={s.id} className="group">
            <a
              href={s.href ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col rounded-xl border border-white/10 p-3 hover:bg-white/5 transition"
            >
              <div className="truncate text-sm font-medium text-white">{s.name}</div>
              <div className="truncate text-xs text-white/60">{s.description}</div>
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
