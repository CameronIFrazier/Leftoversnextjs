"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query) return;

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
                Search results for: <span className="text-purple-400">{query}</span>
            </h1>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && results.length === 0 && <p>No users found.</p>}

            <div className="flex flex-col gap-4">
                {results.map((user) => (
                    <div
                        key={user.id}
                        className="border border-gray-700 rounded-lg p-4 hover:border-purple-400 transition-colors"
                    >
                        <p className="text-lg font-semibold">{user.username}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
