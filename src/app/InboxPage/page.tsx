"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FloatingDockDemo } from "../components/ui/FloatingDockDemo";

interface Conversation {
  id: number;
  otherUser: string;
  lastMessage: string;
  updatedAt: string;
}

interface User {
  id: number;
  username: string;
  name?: string;
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
      <div className="sticky top-0 z-50 w-full bg-black/95 border-b border-gray-700 flex px-6 items-center justify-between mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 inline-block pr-54 pl-4">Inbox</h1>
            <FloatingDockDemo />
      </div>
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <button
          onClick={openCompose}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
        >
          Compose
        </button>
      </div>

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
                <span className="text-xs text-gray-400 truncate w-32 text-right">
                  {conv.lastMessage?.substring(0, 30) || ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">
              Start New Conversation
            </h2>

            {loadingUsers ? (
              <p>Loading users...</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-gray-400">No other users found.</p>
                ) : (
                  users.map((user) => (
                    <li key={user.id}>
                      <button
                        onClick={() => router.push(`/Inbox/${user.username}`)}
                        className="w-full text-left bg-indigo-800 hover:bg-purple-700 p-2 rounded"
                      >
                        {user.name || user.username}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}

            <button
              onClick={() => setShowCompose(false)}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
