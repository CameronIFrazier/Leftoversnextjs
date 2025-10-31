"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
  href,
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
      className={`group flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
        isActive ? "bg-neutral-100 dark:bg-neutral-800" : ""
      }`}
      aria-label={label}
    >
      <div className="h-6 w-6">{children}</div>
      <span className="text-xs text-neutral-600 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white">
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
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        {initials}
      </span>
    </div>
  );
}

export default function InboxPage() {
  const router = useRouter();
  const [filterUnread, setFilterUnread] = React.useState(false);
  const [filterStarred, setFilterStarred] = React.useState(false);

  const filtered = MOCK_MESSAGES.filter((m) => {
    if (filterUnread && !m.unread) return false;
    if (filterStarred && !m.starred) return false;
    return true;
  });

  return (
    <main className="mx-auto max-w-5xl px-3 py-6 sm:px-6">
      {/* Title */}
      <h1 className="mb-4 text-center text-lg font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
        Inbox page view
      </h1>

      {/* Top Icon Bar */}
      <nav className="mb-6 rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-2">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <IconLink href="/" label="Home">
              <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            </IconLink>
            <IconLink href="/profilePage" label="Create Post">
              <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            </IconLink>
            <IconLink href="/SponsorPage" label="Sponsors">
              <Image
                src="/s.svg"
                alt="Sponsors"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
                priority
              />
            </IconLink>
            <IconLink href="/Inbox" label="Inbox">
              <Image
                src="/inbox-svgrepo-com.svg"
                alt="Inbox"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
                priority
              />
            </IconLink>
            <IconLink href="/profilePage" label="Profile">
              <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            </IconLink>
            <IconLink href="/feedPage" label="Feed">
              <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            </IconLink>
          </div>
        </div>
      </nav>

      {/* Inbox Shell */}
      <section className="rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        {/* Filters Row */}
        <div className="flex items-center gap-4 border-b border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700">
          <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-200">
            <IconFilter className="h-4 w-4" />
            <span className="font-medium">Filters</span>
            <IconArrowRight className="h-4 w-4 opacity-60" />
          </div>

          <button
            type="button"
            onClick={() => setFilterUnread((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              filterUnread
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
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
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
            }`}
            aria-pressed={filterStarred}
          >
            <IconStar className="h-4 w-4" /> Starred
          </button>

          <div className="ml-auto">
            <button
              type="button"
              onClick={() => router.push("/Inbox/compose")}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 active:translate-y-[1px] dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              <IconPencil className="h-4 w-4" /> Compose
            </button>
          </div>
        </div>

        {/* Messages */}
        <ul role="list" className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {filtered.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => router.push(`/Inbox/${m.id}`)}
                className="group flex w-full items-center gap-4 px-4 py-5 text-left transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:hover:bg-neutral-800 dark:focus-visible:ring-white"
                aria-label={`Open conversation with ${m.from}`}
              >
                <Avatar name={m.from} />

                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {m.from}
                      </p>
                      {m.unread && (
                        <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold leading-4 text-white dark:bg-white dark:text-black">
                          Unread
                        </span>
                      )}
                      {m.starred && (
                        <IconStar className="h-4 w-4 fill-yellow-400 text-yellow-500" aria-hidden />
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-neutral-600 dark:text-neutral-300">
                      {m.preview}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-xs font-medium text-neutral-500 opacity-70 group-hover:opacity-100 dark:text-neutral-400">
                    Click anywhere to respond
                  </p>
                </div>
              </button>
            </li>
          ))}

          {filtered.length === 0 && (
            <li className="px-4 py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
              No messages match your filters.
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}
