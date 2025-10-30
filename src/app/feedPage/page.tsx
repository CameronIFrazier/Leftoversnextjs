import React, { useMemo } from "react";

// ---- Types ----
export type Sponsor = {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  href?: string;
};

export type User = {
  name: string;
  handle?: string;
  avatarUrl?: string;
};

// ---- Utilities ----
function pickRandomSponsors(list: Sponsor[], count = 3): Sponsor[] {
  // Deduplicate by id and pick a shuffled slice without mutating the input
  const unique = Array.from(new Map(list.map(s => [s.id ?? s.name, s])).values());
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }
  return unique.slice(0, Math.max(0, Math.min(count, unique.length)));
}

// ---- Mini Profile Card ----
function MiniProfile({ user }: { user: User }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-black/40 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full border border-white/20">
          {/* Avatar */}
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-white/70">
              {user.name?.[0] ?? "?"}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{user.name}</div>
          {user.handle && (
            <div className="truncate text-xs text-white/60">@{user.handle}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Sponsors Card List ----
function SponsorsList({ sponsors }: { sponsors: Sponsor[] }) {
  const randomThree = useMemo(() => pickRandomSponsors(sponsors, 3), [sponsors]);

  return (
    <div className="rounded-2xl border border-white/20 bg-black/40 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Featured Sponsors</h3>
        <span className="text-[10px] uppercase tracking-widest text-indigo-300/80">Random 3</span>
      </div>
      <ul className="space-y-3">
        {randomThree.map((s) => (
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
        {randomThree.length === 0 && (
          <li className="text-xs text-white/60">No sponsors found.</li>
        )}
      </ul>
    </div>
  );
}

// ---- Right Sidebar (Eric's section) ----
export function RightSidebar({ user, sponsors }: { user: User; sponsors: Sponsor[] }) {
  return (
    <aside className="sticky top-4 flex w-full flex-col gap-4 xl:w-1/4">
      <MiniProfile user={user} />
      <SponsorsList sponsors={sponsors} />
    </aside>
  );
}

// ---- Example Home layout wiring ----
// This shows how to keep a center feed with space and your right-hand column ~1/4 width on xl screens.
// On smaller screens the sidebar will stack below; tweak breakpoints as you prefer.
export default function Home() {
  // Example data – replace with your real user/sponsor sources.
  const user: User = {
    name: "Eric Lee",
    handle: "eric",
    avatarUrl: "/pfp.png",
  };

  const sponsors: Sponsor[] = [
    { id: "100t", name: "100 Thieves", description: "Gaming org based in LA", logoUrl: "/logos/100t.png", href: "/sponsors/100t" },
    { id: "liquid", name: "Team Liquid", description: "Global esports team", logoUrl: "/logos/tl.png", href: "/sponsors/team-liquid" },
    { id: "sentinels", name: "Sentinels", description: "Esports org from LA", logoUrl: "/logos/sen.png" },
    { id: "c9", name: "Cloud9", description: "Esports org from NA", logoUrl: "/logos/c9.png" },
    { id: "guard", name: "The Guard", description: "LA-based esports org" },
  ];

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Grid: [left spacer] [center feed] [right sidebar (~1/4)] */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Center Feed (leaves some whitespace to the left on wide screens) */}
          <section className="xl:col-span-8">
            <div className="rounded-2xl border border-white/20 bg-black/40 p-4">
              <h1 className="mb-4 text-xl font-bold">Feed</h1>
              <div className="space-y-4">
                {/* Feed items go here */}
                <div className="rounded-xl border border-white/10 p-4">Hello</div>
                <div className="rounded-xl border border-white/10 p-4">Post #2</div>
                <div className="rounded-xl border border-white/10 p-4">Post #3</div>
              </div>
            </div>
          </section>

          {/* Right Sidebar (~1/4 width) */}
          <div className="xl:col-span-3 xl:col-start-10">
            <RightSidebar user={user} sponsors={sponsors} />
          </div>
        </div>
      </div>
    </main>
  );
}
