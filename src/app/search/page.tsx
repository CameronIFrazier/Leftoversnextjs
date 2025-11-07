"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type SearchUser = {
  id: number;
  username: string;
  email: string;
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  
  const params = use(searchParams);
  const query = typeof params?.query === "string" ? params.query : "";

  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);

    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error: ${res.status} - ${text}`);
        }
        return res.json();
      })
      .then((data) => setResults(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Search error:", err);
        setError("Something went wrong while searching.");
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">
        Search results for:{" "}
        <span className="text-purple-400">{query || "(none)"}</span>
      </h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && query && results.length === 0 && <p>No users found.</p>}
      {!loading && !error && !query && (
        <p>Type a query in the URL (?query=...) to search.</p>
      )}

      <div className="flex flex-col gap-4 mt-4">
        {results.map((user) => (
          <Link
            key={user.id}
            href={`/users/${user.id}`}
            className="block border border-gray-700 rounded-lg p-4 hover:border-purple-400 transition-colors w-[320px]"
          >
            <p className="text-lg font-semibold">{user.username}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
