"use client";
import React, { useState, useEffect } from "react";

interface SuggestionItem {
  id: number | string;
  name: string;
  handle?: string;
  avatar?: string | null;
  username?: string;
}

export function PeopleYouMayKnow() {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [following, setFollowing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Get current user's username
        let currentUsername = null;
        if (token) {
          const resMe = await fetch("/api/getUserName", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const dataMe = await resMe.json();
          currentUsername = dataMe.userName;
        }

        const resUsers = await fetch('/api/users');
        const usersJson = await resUsers.json();
        const allUsers = usersJson.users || [];

        // Filter out current user
        const filtered = allUsers.filter((u: any) => u.username !== currentUsername);

        // Shuffle
        const candidates = [...filtered];
        for (let i = candidates.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
        }

        const picked = candidates.slice(0, 5).map((u: any) => ({
          id: u.id,
          name: u.name || `${u.firstname || ''} ${u.lastname || ''}`.trim() || u.username,
          handle: u.username,
          avatar: u.avatar || u.profile_pic || null,
          username: u.username,
        }));

        setSuggestions(picked);
      } catch (e) {
        console.error("Failed to load suggestions:", e);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <div className="rounded-2xl border border-white/20 bg-black/40 p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-purple-300 mb-4">People you may know</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {suggestions.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-3 p-2 rounded-md bg-black/20">
            <div className="flex items-center gap-3">
              {s.avatar ? (
                <img src={s.avatar} alt={`${s.name} avatar`} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-sm font-semibold text-white">
                  {s.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">{s.name}</span>
                <span className="text-xs text-purple-300">@{s.handle ?? s.name.toLowerCase().replace(/\s+/g,'')}</span>
              </div>
            </div>

            <button
              onClick={() => setFollowing((f) => ({ ...f, [String(s.id)]: !f[String(s.id)] }))}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                following[String(s.id)]
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {following[String(s.id)] ? "Following" : "Follow"}
            </button>
          </div>
        ))}

        {suggestions.length === 0 && (
          <p className="text-sm text-purple-300 text-center">No suggestions found</p>
        )}
      </div>
    </div>
  );
}
