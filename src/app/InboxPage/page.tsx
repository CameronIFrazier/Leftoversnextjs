"use client";
//force deploy comment
import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { FloatingDockDemo } from "../components/ui/FloatingDockDemo";
import { useRouter, usePathname } from "next/navigation";
import {
  IconHome,
  IconNewSection,
  IconUser,
  IconTerminal2,
  IconStar,
  IconMail,
  IconFilter,
  IconArrowRight,
  IconPencil,
} from "@tabler/icons-react";

type Message = {
  id: string;
  from: string;
  preview: string;
  unread?: boolean;
  starred?: boolean;
};

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    from: "Avery Park",
    preview: "Hey! I saw your latest post and had a quick question about…",
    unread: true,
    starred: false,
  },
  {
    id: "2",
    from: "Leftovers Team",
    preview: "Welcome to your inbox. Click anywhere on a message to reply.",
    unread: false,
    starred: true,
  },
  {
    id: "3",
    from: "Samir Patel",
    preview: "Are you still looking for sponsors for your next write‑up?",
    unread: true,
    starred: false,
  },
];

function IconLink({
  href = "https://leftoversnextjs-pyhl.vercel.app/DM",
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`group flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition hover:bg-purple-800 ${
        isActive ? "bg-purple-800" : ""
      }`}
      aria-label={label}
    >
      <div className="h-6 w-6">{children}</div>
      <span className="text-xs text-purple-300 group-hover:text-white">
        {label}
      </span>
    </Link>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400 bg-indigo-800 shadow-sm">
      <span className="text-sm font-semibold text-purple-200">
        {initials}
      </span>
    </div>
  );
}

export default function InboxPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filterUnread, setFilterUnread] = React.useState(false);
  const [filterStarred, setFilterStarred] = React.useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let messages = MOCK_MESSAGES;
    
    // Apply text search filter
    if (q) {
      messages = messages.filter((m) =>
        [m.from, m.preview]
          .filter(Boolean)
          .some((field) => (field as string).toLowerCase().includes(q))
      );
    }
    
    // Apply existing filters
    messages = messages.filter((m) => {
      if (filterUnread && !m.unread) return false;
      if (filterStarred && !m.starred) return false;
      return true;
    });
    
    return messages;
  }, [query, filterUnread, filterStarred]);

  return (
    <section className="w-full flex flex-col items-center bg-black text-white min-h-screen">
      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-6">

      {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 inline-block pr-54 pl-4">Inbox</h1>
          </div>
          <div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search inbox..."
              className="px-3 py-2 w-64 rounded-md border border-white bg-indigo-900 placeholder-gray-300"
            />
          </div>
        </div>

      {/* Inbox Shell */}
      <section className="rounded-3xl border border-purple-500 bg-indigo-900 shadow-sm">
        {/* Filters Row */}
        <div className="flex items-center gap-4 border-b border-purple-400 px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-purple-200">
            <IconFilter className="h-4 w-4" />
            <span className="font-medium">Filters</span>
            <IconArrowRight className="h-4 w-4 opacity-60" />
          </div>

          <button
            type="button"
            onClick={() => setFilterUnread((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              filterUnread
                ? "border-purple-400 bg-purple-600"
                : "border-purple-400 text-purple-200 hover:bg-purple-800"
            }`}
            aria-pressed={filterUnread}
          >
            <IconMail className="h-4 w-4" /> Unread
          </button>

          <button
            type="button"
            onClick={() => setFilterStarred((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              filterStarred
                ? "border-purple-400 bg-purple-600"
                : "border-purple-400 text-purple-200 hover:bg-purple-800"
            }`}
            aria-pressed={filterStarred}
          >
            <IconStar className="h-4 w-4" /> Starred
          </button>

          <div className="ml-auto">
            <button
              type="button"
              onClick={() => router.push("/Inbox/compose")}
              className="inline-flex items-center gap-2 rounded-full border border-purple-400 bg-indigo-800 px-4 py-2 text-xs font-semibold text-purple-200 shadow-sm transition hover:bg-purple-800 active:translate-y-[1px]"
            >
              <IconPencil className="h-4 w-4" /> Compose
            </button>
          </div>
        </div>

        {/* Messages */}
        <ul role="list" className="divide-y divide-purple-400">
          {filtered.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => router.push(`/Inbox/${m.id}`)}
                className="group flex w-full items-center gap-4 px-4 py-5 text-left transition hover:bg-purple-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                aria-label={`Open conversation with ${m.from}`}
              >
                <Avatar name={m.from} />

                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {m.from}
                      </p>
                      {m.unread && (
                        <span className="rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-semibold leading-4">
                          Unread
                        </span>
                      )}
                      {m.starred && (
                        <IconStar className="h-4 w-4 fill-yellow-400 text-yellow-500" aria-hidden />
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-purple-200">
                      {m.preview}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-xs font-medium text-purple-300 opacity-70 group-hover:opacity-100">
                    Click anywhere to respond
                  </p>
                </div>
              </button>
            </li>
          ))}

          {filtered.length === 0 && (
            <li className="px-4 py-12 text-center text-sm text-purple-300">
              No messages match your filters.
            </li>
          )}
        </ul>
      </section>
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <FloatingDockDemo />
      </div>
      </div>
    </section>
  );
}
