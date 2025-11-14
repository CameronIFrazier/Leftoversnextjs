"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ConversationPage() {
  const params = useParams();
  const userB = params?.id as string;

  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
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

  // Fetch messages whenever userB changes or currentUser is set
  useEffect(() => {
    if (!userB || !currentUser) return;

    setMessages([]);
    setLoading(true);

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `/api/loadConversation?userA=${currentUser}&userB=${userB}`
        );
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [userB, currentUser]);

  const sendMessage = async () => {
    if (!messageText.trim() || !userB || !currentUser) return;

    try {
      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: currentUser,
          receiver: userB,
          message: messageText,
        }),
      });

      // Append message locally for instant UI feedback
      setMessages((prev) => [
        ...prev,
        { sender: currentUser, receiver: userB, message: messageText, created_at: new Date() },
      ]);

      setMessageText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-6">
      <div className="w-full max-w-xl flex flex-col h-screen">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <a href="/InboxPage" className="text-purple-400">
            ← Back
          </a>

          <h2 className="text-lg font-semibold">{userB}</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-white/20 bg-black/40 p-4 shadow-sm p-4 space-y-3">
          {loading ? (
            <p>Loading conversation...</p>
          ) : messages.length === 0 ? (
            <p className="text-gray-400">No messages yet.</p>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-md max-w-[80%] ${
                  m.sender === currentUser
                    ? "bg-indigo-500 self-end ml-auto" //sender bubble
                    : "bg-blue-900 self-start"  //receiver bubble
                }`}
              >
                <p>{m.message}</p>
                <p className="text-xs text-gray-400 mt-1">{m.sender}</p> {/* username under the text message */}
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="mt-3 pt-3 flex gap-2">
          <textarea
            className="flex-grow rounded-lg p-1 text-white bg-indigo-800/30 focus:outline-none focus:border-indigo-400 resize-none"
            placeholder={`Message ${userB}...`}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-purple-600 px-2 py-2 rounded-lg hover:bg-purple-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
