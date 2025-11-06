"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Conversation {
  id: number;
  otherUser: string;
  lastMessage: string;
  updatedAt: string;
}

export default function InboxPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

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
        if (data.conversations) setConversations(data.conversations);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-8">
      <h1 className="text-2xl font-bold mb-6">Inbox</h1>

      {loading ? (
        <p>Loading conversations...</p>
      ) : conversations.length === 0 ? (
        <p className="text-gray-400">No conversations yet.</p>
      ) : (
        <ul className="w-full max-w-md space-y-2">
          {conversations.map((conv) => (
            <li key={conv.id}>
              <button
                onClick={() => router.push(`/Inbox/${conv.otherUser}`)}
                className="w-full text-left bg-indigo-900 hover:bg-purple-800 p-3 rounded flex justify-between items-center"
              >
                <span>{conv.otherUser}</span>
                <span className="text-xs text-gray-400">
                  {conv.lastMessage?.substring(0, 30) || ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
