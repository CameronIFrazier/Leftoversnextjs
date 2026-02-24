"use client";
import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import Thieves from "@/../public/sponsors/100thieves.png";
import Cloud9 from "@/../public/sponsors/cloud9.png";
import FaZeClan from "@/../public/sponsors/faze-clan.png";
import Complexity from "@/../public/sponsors/complexity-gaming.png";
import TeamLiquid from "@/../public/sponsors/teamliquid.png";

export type Sponsor = {
  id: string;
  name: string;
  description: string;
  href: string;
  logo: StaticImageData;
};

const sponsors: Sponsor[] = [
  { id: "1", name: "FaZe Clan", description: "Professional esports organization", href: "https://fazeclan.com", logo: FaZeClan },
  { id: "2", name: "Cloud9", description: "Global esports & entertainment", href: "https://cloud9.gg", logo: Cloud9 },
  { id: "3", name: "100 Thieves", description: "Esports & lifestyle brand", href: "https://100thieves.com", logo: Thieves },
  { id: "4", name: "Team Liquid", description: "World-class esports team", href: "https://teamliquid.com", logo: TeamLiquid },
  { id: "5", name: "Complexity Gaming", description: "Top levelesports organization", href: "https://complexity.gg", logo: Complexity },
];

export function SponsorsList() {
  return (
    <div className="rounded-2xl border border-white/20 bg-black/40 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-white mb-3">Featured Sponsors</h3>
      <ul className="space-y-2">
        {sponsors.map((s) => (
          <li key={s.id}>
            <a href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-white/10 p-2.5 hover:bg-white/5 transition group">
              <div className="w-8 h-8 rounded-full  flex items-center justify-center flex-shrink-0 overflow-hidden bg-black">
                <Image src={s.logo} alt={s.name} width={24} height={24} className="object-contain" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">{s.name}</div>
                <div className="truncate text-xs text-white/50">{s.description}</div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}