"use client";
import React, { useMemo, useState } from "react";
import { FloatingDockDemo } from "../components/ui/FloatingDockDemo";
import GradientBorder from "../components/ui/GradientBorder";

type Sponsor = {
  name: string;
  short?: string;
  description: string;
  location?: string;
  website?: string;
};

const SPONSORS: Sponsor[] = [
  {
    name: "100 Thieves",
    short: "100T",
    description: "100 Thieves is a premium lifestyle brand and eSports gaming company. 100 Thieves’ eSports teams have competed and won championships in some of the top games worldwide, including League of Legends, Call of Duty, and VALORANT and have collaborated with leading companies such as Rockstar, Lexus, JBL, the NBA2K franchise.",
    location: "Los Angeles, CA",
    website: "https://100thieves.com",
  },
  {
    name: "Team Liquid",
    description: "Team Liquid is one of the biggest esports brands in the world. More than just a successful competitive gaming team, we are a broad based enterprise with businesses in online properties, video production, and influencer and campaign management. We have multiple championships across a dozen games, the highest earning team in the world, and the longest brand partnership in esports with Alienware.",
    location: "Santa Monica, CA",
    website: "https://www.teamliquid.com",
  },
    {
    name: "Dignitas",
    description: "Dignitas is an international esports organization and one of the most iconic and recognizable brands in the professional gaming industry, fielding teams in the world's largest and most popular games.",
    location: "Newark, New Jersey",
    website: "https://dignitas.gg/",
  },
  
];

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const initials =
    sponsor.short ??
    sponsor.name
      .split(" ")
      .map((s) => s[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();

  return (
    <GradientBorder>
      <div className="rounded-lg p-4 bg-black hover:bg-indigo-950 transition">
        {/* Avatar and Name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center text-sm font-bold">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-indigo-400">
              {sponsor.name}
            </h2>
            {sponsor.location && (
              <p className="text-sm text-gray-300">{sponsor.location}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-gray-100">
          {sponsor.description}
        </p>

        {/* Website Link Only */}
        {sponsor.website && (
          <a
            href={sponsor.website}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 px-3 py-1 rounded-md border border-white text-xs hover:bg-white hover:text-black transition"
          >
            Visit Website
          </a>
        )}
      </div>
    </GradientBorder>
  );
}

export default function SponsorPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SPONSORS;
    return SPONSORS.filter((s) =>
      [s.name, s.short, s.description, s.location]
        .filter(Boolean)
        .some((field) => (field as string).toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <>
      
      <section className="w-full min-h-screen bg-black text-white flex flex-col items-center">
      <section className="w-[70%] pb-10 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 ">Sponsors</h1>
            <p className="text-sm text-gray-300">
              Discover partners and organizations supporting our community.
            </p>
          </div>
          <div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sponsors..."
              className="px-3 py-2 w-64 rounded-md border border-white bg-indigo-900 placeholder-gray-300 text-white"
            />
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full border border-white rounded-lg p-6 text-center">
              <p className="text-gray-300">No sponsors found.</p>
            </div>
          ) : (
            filtered.map((s) => <SponsorCard key={s.name} sponsor={s} />)
          )}
        </div>
        
      </section>
      
      {/* Fixed dock at bottom */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDockDemo />
      </div>
    </section>
    </>
  );
}


  