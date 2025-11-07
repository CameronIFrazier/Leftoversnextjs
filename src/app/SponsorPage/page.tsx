"use client";
import React, { useMemo, useState } from "react";
import { FloatingDockDemo } from "../components/ui/FloatingDockDemo";
import GradientBorder from "../components/ui/GradientBorder";
import Image from "next/image";
import Link from "next/link";

type Sponsor = {
  name: string;
  short?: string;
  description: string;
  location?: string;
  website?: string;
  logo: string; // Path to the logo image in public/sponsors directory
};

const SPONSORS: Sponsor[] = [
  {
    name: "100 Thieves",
    short: "100T",
    description: "100 Thieves is a premium lifestyle brand and eSports gaming company. 100 Thieves' eSports teams have competed and won championships in some of the top games worldwide, including League of Legends, Call of Duty, and VALORANT and have collaborated with leading companies such as Rockstar, Lexus, JBL, the NBA2K franchise.",
    location: "Los Angeles, CA",
    website: "https://100thieves.com",
    logo: "/sponsors/100thieves.png"
  },
  {
    name: "Team Liquid",
    description: "Team Liquid is one of the biggest esports brands in the world. More than just a successful competitive gaming team, we are a broad based enterprise with businesses in online properties, video production, and influencer and campaign management. We have multiple championships across a dozen games, the highest earning team in the world, and the longest brand partnership in esports with Alienware.",
    location: "Santa Monica, CA",
    website: "https://www.teamliquid.com",
    logo: "/sponsors/teamliquid.png"
  },
  {
    name: "Dignitas",
    description: "Dignitas is an international esports organization and one of the most iconic and recognizable brands in the professional gaming industry, fielding teams in the world's largest and most popular games.",
    location: "Newark, New Jersey",
    website: "https://dignitas.gg/",
    logo: "/sponsors/dignitas.png"
  },
  {
    name: "Cloud9",
    description: "Cloud9 is a premier North American esports organization known for its championship-winning teams and strong presence across games like League of Legends, VALORANT, and Counter-Strike. It's recognized for its commitment to excellence and player development.",
    location: "Los Angeles, California",
    website: "https://www.cloud9.gg/",
    logo: "/sponsors/cloud9.png"
  },
  {
    name: "FaZe Clan",
    description: "FaZe Clan is one of the most prominent lifestyle and esports organizations in the world, known for its dominance in competitive gaming and massive influence in pop culture, entertainment, and apparel.",
    location: "Los Angeles, California",
    website: "https://fazeclan.com/",
    logo: "/sponsors/faze-clan.png"
  },
  {
    name: "NRG Esports",
    description: "NRG Esports is a leading North American organization competing in top titles like Rocket League, VALORANT, and Apex Legends. Known for its creative branding and community engagement, NRG blends competitive success with entertainment flair.",
    location: "Los Angeles, California",
    website: "https://www.nrg.gg/",
    logo: "/sponsors/nrg-esports.png"
  },
  {
    name: "Sentinels",
    description: "Sentinels is an American esports organization known for its success in VALORANT and Halo. It's recognized for its strong fan base, elite rosters, and engaging content creation.",
    location: "Los Angeles, California",
    website: "https://www.sentinels.gg/",
    logo: "/sponsors/sentinels.png"
  },
  {
      name: "G2 Esports",
      description: "G2 Esports is a leading European esports organization known for its dominance in games like League of Legends, VALORANT, and Counter-Strike. Founded by former pro player Carlos 'Ocelote' Rodríguez, G2 is recognized for its elite rosters and strong entertainment brand.",
      location: "Berlin, Germany",
      website: "https://g2esports.com/",
      logo: "/sponsors/g2-esports.png"
  },
  {
      name: "OpTic Gaming",
      description: "OpTic Gaming is an iconic North American esports organization with roots in competitive Call of Duty. Known as 'The Green Wall,' OpTic has expanded into games like Halo, VALORANT, and Rocket League.",
      location: "Frisco, Texas",
      website: "https://opticgaming.com/",
      logo: "/sponsors/optic-gaming.png"
  },
  {
      name: "Complexity Gaming",
      description: "Complexity Gaming is one of the longest-running North American esports organizations, competing in games such as Counter-Strike, Rocket League, and Madden. The organization is known for its professionalism and partnership with the Dallas Cowboys.",
      location: "Frisco, Texas",
      website: "https://complexity.gg/",
      logo: "/sponsors/complexity-gaming.png"
  },
  {
      name: "Team Vitality",
      description: "Team Vitality is a top-tier European esports organization competing in games like League of Legends, Counter-Strike, and Rocket League. Known for its bold branding and high-level competition, Vitality has become a cornerstone of the EU esports scene.",
      location: "Paris, France",
      website: "https://vitality.gg/",
      logo: "/sponsors/team-vitality.png"
  },
  
];

// Sponsor card generate
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
    <div className="border border-white rounded-lg p-4 bg-black">
      {/* Avatar and Name */}
      <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center text-sm font-bold overflow-hidden relative">
          {sponsor.logo ? (
            <Image
              src={sponsor.logo}
              alt={`${sponsor.name} logo`}
              fill
              className="object-contain p-1"
            />
          ) : (
            <span className="relative z-10">{initials}</span>
          )}
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
    <section className="w-full min-h-screen bg-black text-white flex flex-col items-center pb-10 pt-8 w-[70%] px-10 py-10">
        {/* Header */}
              <div className="sticky top-0 z-50 w-full bg-black/95 border-b border-gray-700 flex px-6 items-center justify-between mb-6">
                <div className =  "flex flex-col">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 inline-block pr-54 pl-4 sm:pr-20">Find Sponsor</h1>
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
                <FloatingDockDemo />
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
  );
}