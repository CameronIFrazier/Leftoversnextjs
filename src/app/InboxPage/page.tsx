"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InboxPage() {
  const router = useRouter();
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>("");

  // ✅ Only access localStorage inside useEffect
  useEffect(() => {
    const tokenUserName = localStorage.getItem("tokenUserName");
    setCurrentUser(tokenUserName || "userA");
  }, []);

  useEffect(() => {
    if (!showUsers || !currentUser) return;
    setLoading(true);

    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        console.log("Users from API:", data); // debug
        if (data.users && Array.isArray(data.users)) {
          const filtered = data.users.filter(
            (u: any) => u.username && u.username !== currentUser
          );
          setUsers(filtered);
        } else {
          setUsers([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, [showUsers, currentUser]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-8">
      <button
        onClick={() => setShowUsers((s) => !s)}
        className="bg-purple-600 px-4 py-2 rounded mb-4"
      >
        Compose
      </button>

      {showUsers && (
        <div className="w-full max-w-md border border-purple-600 p-4 rounded">
          <h2 className="text-lg mb-2">Select a user to message</h2>
          {loading && <p>Loading...</p>}
          {!loading && users.length === 0 && <p>No users found</p>}
          <ul className="space-y-2">
            {users.map((u) => (
              <li key={u.id}>
                <button
                  onClick={() => router.push(`/Inbox/${u.username}`)}
                  className="w-full text-left bg-indigo-900 hover:bg-purple-800 p-2 rounded"
                >
                  {u.name || u.username}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
