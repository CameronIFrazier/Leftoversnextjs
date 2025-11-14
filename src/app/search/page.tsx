"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

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
  const initialQuery = typeof params?.query === "string" ? params.query : "";
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery.trim())}`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error: ${response.status} - ${text}`);
      }
      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search error:", err);
      setError("Something went wrong while searching.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Update URL without triggering page refresh
    if (newQuery.trim()) {
      const newUrl = `/search?query=${encodeURIComponent(newQuery.trim())}`;
      window.history.replaceState({}, '', newUrl);
    } else {
      window.history.replaceState({}, '', '/search');
    }

    // Perform search with new query
    performSearch(newQuery);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission now just focuses the input since search is real-time
    if (query.trim()) {
      performSearch(query.trim());
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  // Update local query state when URL changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10">
      {/* Back Button */}
      <div className="w-full max-w-4xl mb-6">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200 mb-4"
        >
          <IconArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      {/* Title */}
      {!initialQuery && (
        <h1 className="text-3xl font-bold mb-6">Search Users</h1>
      )}

      {/* Search Input */}
      <div className="w-full max-w-4xl mb-8">
        <form onSubmit={handleSearch} className="w-full max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search for users..."
              className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-purple-400 transition-colors duration-200"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Helper text when no search query */}
      {!loading && !error && !query.trim() && (
        <p className="text-gray-400 text-center mb-8">Enter a search term above to find users.</p>
      )}

      {/* Search Results Title */}
      {query.trim() && (
        <h1 className="text-3xl font-bold mb-6">
          Search results for:{" "}
          <span className="text-purple-400">{query.trim()}</span>
        </h1>
      )}

      {/* Loading, Error, and No Results Messages */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && query.trim() && results.length === 0 && <p>No users found.</p>}

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
