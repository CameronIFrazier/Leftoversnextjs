"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FloatingDockDemo } from "@/app/components/ui/FloatingDockDemo";
import LoadingDots from "@/app/components/ui/LoadingDots";

interface Conversation {
  id: number;
  otherUser: string;
  otherUserAvatar?: string;
  lastMessage: string;
  updatedAt: string;
}

interface User {
  id: number;
  username: string;
  name?: string;
  avatar?: string;
}

function formatLastMessage(lastMessage: any): string {
  if (!lastMessage) return "";
  try {
    if (typeof lastMessage === "object" && lastMessage.type) {
      if (lastMessage.type === "shared_post") {
        const media = lastMessage.post?.media || "";
        if (/\.(mp4|mov|webm|ogg)$/i.test(media)) return "📹 Shared a video";
        return "🖼️ Shared a photo";
      }
      return lastMessage.text || "Message";
    }
    if (typeof lastMessage === "string" && lastMessage.startsWith("{")) {
      const parsed = JSON.parse(lastMessage);
      return formatLastMessage(parsed);
    }
    return lastMessage;
  } catch (err) {
    return typeof lastMessage === "string" ? lastMessage : "";
  }
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function InboxPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    async function fetchCurrentUser() {
      try {
        const res = await fetch("/api/getUserName", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.userName) setCurrentUser(data.userName);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    }
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    async function fetchConversations() {
      setLoading(true);
      try {
        const res = await fetch(`/api/getConversations?user=${currentUser}`);
        const data = await res.json();
        if (data.conversations) setConversations(data.conversations);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, [currentUser]);

  const openCompose = async () => {
    setShowCompose(true);
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.users) {
        const filtered = data.users.filter((u: User) => u.username !== currentUser);
        setUsers(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.otherUser.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center relative overflow-hidden ">

      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-900/20 blur-[100px]" />
      </div>

      {/* Navbar */}
      <div className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/5 flex px-6 items-center justify-between py-3 mb-4">
        <div className="flex items-center gap-3 pl-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Messages</h1>
          {conversations.length > 0 && (
            <span className="text-xs bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
              {conversations.length}
            </span>
          )}
        </div>
        <FloatingDockDemo />
      </div>

      <div className="w-full max-w-lg px-4 z-10 flex flex-col gap-4">

        {/* Search + Compose row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/8 transition-all"
            />
          </div>
          <button
            onClick={openCompose}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-900/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New
          </button>
        </div>

        {/* Conversations list */}
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <LoadingDots />
            <p className="text-sm text-gray-500">Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">No conversations yet</p>
            <p className="text-gray-600 text-sm">Hit <span className="text-indigo-400">New</span> to start chatting</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {filteredConversations.map((conv, i) => (
              <li
                key={conv.id}
                style={{ animationDelay: `${i * 40}ms` }}
                className="animate-fadeIn"
              >
                <button
                  onClick={() => router.push(`/Inbox/${conv.otherUser}`)}
                  className="group w-full text-left bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-indigo-500/30 p-3.5 rounded-2xl flex gap-3 items-center transition-all duration-200"
                >
                  <div className="relative flex-shrink-0">
                    {conv.otherUserAvatar ? (
                      <img
                        src={conv.otherUserAvatar}
                        alt={conv.otherUser}
                        className="rounded-full h-11 w-11 object-cover ring-2 ring-white/10 group-hover:ring-indigo-500/40 transition-all"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-semibold text-lg ring-2 ring-white/10 group-hover:ring-indigo-500/40 transition-all">
                        {conv.otherUser.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#080808]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-white text-sm">{conv.otherUser}</span>
                      <span className="text-[11px] text-gray-600 group-hover:text-gray-500 transition-colors">
                        {timeAgo(conv.updatedAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate group-hover:text-gray-400 transition-colors">
                      {formatLastMessage(conv.lastMessage) || "Start a conversation"}
                    </p>
                  </div>

                  <svg className="w-4 h-4 text-gray-700 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCompose(false); }}
        >
          <div className="bg-[#111] border border-white/10 rounded-2xl p-5 w-full max-w-sm shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">New Message</h2>
              <button
                onClick={() => setShowCompose(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-3">Select someone to message</p>

            {loadingUsers ? (
              <div className="flex flex-col items-center gap-2 py-8">
                <LoadingDots />
                <p className="text-sm text-gray-500">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">No other users found.</p>
            ) : (
              <ul className="space-y-1 max-h-72 overflow-y-auto pr-1">
                {users.map((user) => (
                  <li key={user.id}>
                    <button
                      onClick={() => router.push(`/Inbox/${user.username}`)}
                      className="w-full text-left hover:bg-white/5 p-2.5 rounded-xl flex items-center gap-3 transition-colors group"
                    >
                      {user.avatar && user.avatar.trim() !== "" ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-1 ring-white/10"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {(user.name?.[0] ?? user.username?.[0] ?? "?").toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-white truncate">{user.name || user.username}</span>
                        {user.name && (
                          <span className="text-xs text-gray-500">@{user.username}</span>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-gray-700 group-hover:text-indigo-400 ml-auto flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}