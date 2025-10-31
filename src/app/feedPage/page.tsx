// src/app/feedPage/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { SPONSORS } from "@/app/sponsorData/sponsor"; // adjust if moved

// pick 3 random sponsors
function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

export default function FeedPage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);


  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  // random sponsors once
  const sponsorPicks = useMemo(() => pickRandom(SPONSORS, 3), []);

  // fetch user info (same APIs as profile page)
  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [resUser, resPfp, resHighlight] = await Promise.all([
          fetch("/api/getUserName", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/getUserPfp", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/getUserHighlight", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const dataUser = await resUser.json();
        const dataPfp = await resPfp.json();
        const dataHighlight = await resHighlight.json();

        if (dataUser?.userName) setUserName(dataUser.userName);
        if (dataPfp?.profilePic) setProfilePic(dataPfp.profilePic);
        if (dataHighlight?.highlight) setHighlight(dataHighlight.highlight);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

          {/* FEED CONTENT */}
          <section className="xl:col-span-8">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <h1 className="text-xl font-bold mb-4">Feed</h1>
              {/* TODO: Feed Posts */}
              <div className="rounded-xl border border-white/10 p-4">Post 1</div>
              <div className="rounded-xl border border-white/10 p-4">Post 2</div>
            </div>
          </section>

          {/* RIGHT SIDEBAR */}
          {isClient && (
            <aside className="xl:col-span-3 xl:col-start-10 sticky top-4 flex flex-col gap-4">

              {/* MINI PROFILE */}
              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full border border-white/15 overflow-hidden shrink-0 bg-black flex items-center justify-center">
                    {profilePic ? (
                      <img src={profilePic} alt="pfp" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-white/60">
                        {userName?.[0] ?? "?"}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate font-semibold">
                      {userName ?? "Loading..."}
                    </div>
                    {userName && (
                      <div className="truncate text-sm text-white/60">@{userName.toLowerCase()}</div>
                    )}
                  </div>
                </div>

                {highlight && (
                  <div className="mt-2 truncate text-xs text-white/60">{highlight}</div>
                )}
              </div>

              {/* RANDOM SPONSORS */}
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Featured Sponsors</h3>
                  <span className="text-[10px] uppercase tracking-widest text-indigo-300/80">
                  </span>
                </div>

                <ul className="space-y-3">
                  {sponsorPicks.map((sponsor) => (
                    <li key={sponsor.name}>
                      <a
                        href={sponsor.website ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-white/10 p-3 hover:bg-white/5 transition"
                      >
                        <div className="h-9 w-9 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center bg-black">
                          {sponsor.logo ? (
                            <img src={sponsor.logo} className="h-full w-full object-contain p-1" />
                          ) : (
                            <span className="text-[10px] text-white/70">
                              {sponsor.short ?? sponsor.name.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{sponsor.name}</div>
                          <div className="truncate text-xs text-white/60">
                            {sponsor.location}
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

            </aside>
          )}
        </div>
      </div>
    </main>
  );
}
