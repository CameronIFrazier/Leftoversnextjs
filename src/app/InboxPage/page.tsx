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

// Helper: format lastMessage to hide raw JSON for shared posts
function formatLastMessage(raw: string | null | undefined): string {
  if (!raw) return "";

  // Try to detect {"type":"shared_post", ...}
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.type === "shared_post" && parsed.post) {
      const title =
        typeof parsed.post.title === "string" && parsed.post.title.trim().length
          ? parsed.post.title.trim()
          : "a post";
      return `Shared a post: ${title}`;
    }
  } catch {
    // not JSON – fall through and show raw text
  }

  return raw;
}

export default function InboxPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch current logged-in user from JWT token
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

  // Fetch conversations for the current user
  useEffect(() => {
    if (!currentUser) return;

    async function fetchConversations() {
      setLoading(true);
      try {
        const res = await fetch(`/api/getConversations?user=${currentUser}`);
        const data = await res.json();
        console.log("Conversations data:", data.conversations);
        if (data.conversations) setConversations(data.conversations);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, [currentUser]);

  // Fetch all users when opening compose modal
  const openCompose = async () => {
    setShowCompose(true);
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();

      if (data.users) {
        const filtered = data.users.filter(
          (u: User) => u.username !== currentUser
        );
        setUsers(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-8 relative">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 w-full bg-black/95 border-b border-gray-700 flex px-6 items-center justify-between mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 inline-block pr-54 pl-4">
          Inbox
        </h1>
        <FloatingDockDemo />
      </div>

      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <button
          onClick={openCompose}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full"
        >
          Compose
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-2">
          <LoadingDots />
          <p>Loading conversations...</p>
        </div>
      ) : conversations.length === 0 ? (
        <p className="text-gray-400">No conversations yet.</p>
      ) : (
        <ul className="w-full max-w-md space-y-2">
          {conversations.map((conv) => (
            <li key={conv.id}>
              <button
                onClick={() => router.push(`/Inbox/${conv.otherUser}`)}
                className="w-full text-left border border-indigo-700 bg-black bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:border-indigo-500 p-3 rounded-2xl flex gap-3 items-center"
              >
              {/* Avatar */}
               {conv.otherUserAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={conv.otherUserAvatar} alt={conv.otherUser} className="rounded-full h-10 w-10 object-cover" />
              ) : (
                <div className="h-10 w-10 border border-white/20 rounded-full flex items-center justify-center text-white text-2xl">
                  {conv.otherUser.charAt(0).toUpperCase()}
                </div>
              )}
                
                {/* Username and Last Message */}
                <div className="flex-1 min-w-0 flex justify-between items-center">
                  <span>{conv.otherUser}</span>
                  <span className="text-xs text-gray-400 truncate w-32 text-right ml-2">
                    {conv.lastMessage?.substring(0, 30) || ""}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Compose Modal */}

      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="border border-white/20 rounded-2xl p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">
              Start New Conversation
            </h2>

            {loadingUsers ? (
              
              <div className="flex flex-col items-center gap-2">
                <LoadingDots />
                <p>Loading users...</p>
              </div>
            ) : (
              <ul className="space-y-2 max-h-100 overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-gray-400">No other users found.</p>
                ) : (
                  users.map((user) => (
                    <li key={user.id}>
                      <button
                        onClick={() => router.push(`/Inbox/${user.username}`)}
                        className="w-full text-left bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:from-indigo-600 hover:to-purple-600 p-2 rounded-full flex items-center gap-3"
                      >
                        {/* Avatar */}
                        {user.avatar && user.avatar.trim() !== '' ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white flex-shrink-0">
                            {user.name?.[0] ?? "?"}
                          </div>
                        )}
                        <span>{user.name || user.username}</span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
            <button
              onClick={() => setShowCompose(false)}
              className="mt-4 w-full round-full
               bg-indigo-600 hover:bg-purple-500 p-2 rounded-full"
            >
             Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
