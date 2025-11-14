"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type ChatMessage = {
  sender: string;
  receiver: string;
  message: string;
  created_at?: string | Date;
};

// full/new payload
type SharedPostFull = {
  type: "shared_post";
  note?: string;
  post: {
    id: number;
    title: string;
    description: string;
    username?: string | null;
    avatar?: string | null;
    media_url?: string | null;
    created_at?: string | null;
  };
};

// old payload: only postId + note
type SharedPostLegacy = {
  type: "shared_post";
  postId: number;
  note?: string;
};

function parseSharedPost(
  raw: string
): SharedPostFull | SharedPostLegacy | null {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.type !== "shared_post") return null;

    // has full post object
    if (parsed.post) {
      return {
        type: "shared_post",
        note: parsed.note,
        post: {
          id: Number(parsed.post.id),
          title: String(parsed.post.title ?? ""),
          description: String(parsed.post.description ?? ""),
          username: parsed.post.username ?? null,
          avatar: parsed.post.avatar ?? null,
          media_url: parsed.post.media_url ?? null,
          created_at: parsed.post.created_at ?? null,
        },
      };
    }

    // legacy: only postId + note
    if (parsed.postId) {
      return {
        type: "shared_post",
        postId: Number(parsed.postId),
        note: parsed.note,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/* ------------------------- Message bubble component ------------------------- */

function MessageBubble({
  msg,
  isOwn,
}: {
  msg: ChatMessage;
  isOwn: boolean;
}) {
  const shared = typeof msg.message === "string"
    ? parseSharedPost(msg.message)
    : null;

  const timeStr = msg.created_at
    ? new Date(msg.created_at).toLocaleTimeString()
    : "";

  const baseBubble =
    "p-2 rounded-md max-w-[80%] whitespace-pre-wrap break-words";

  const bubbleColor = isOwn
    ? "bg-blue-700 text-white"
    : "bg-red-800 text-white";

  let content: React.ReactNode;

  if (!shared) {
    // normal text message
    content = <p>{msg.message}</p>;
  } else if ("post" in shared) {
    // new full shared-post payload
    const p = shared.post;
    content = (
      <div className="space-y-2">
        {shared.note && (
          <p className="text-sm font-medium">{shared.note}</p>
        )}
        <div className="rounded-lg border border-white/20 bg-black/30 p-3">
          <div className="flex items-center gap-2 mb-2">
            {p.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.avatar}
                alt={p.username || "user"}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs">
                @
              </div>
            )}
            <div className="flex flex-col">
              {p.username && (
                <span className="text-sm font-semibold">
                  {p.username}
                </span>
              )}
              {p.created_at && (
                <span className="text-[11px] text-gray-200/80">
                  {new Date(p.created_at).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="text-sm font-semibold mb-1">{p.title}</div>
          <div className="text-sm text-gray-100">{p.description}</div>

          {p.media_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.media_url}
              alt="Post media"
              className="mt-2 rounded-md max-h-56 object-cover"
            />
          )}
        </div>
      </div>
    );
  } else {
    // legacy payload – only postId and optional note
    content = (
      <div className="space-y-1">
        {shared.note && <p className="text-sm">{shared.note}</p>}
        <p className="text-sm text-gray-100">
          Shared a post (ID {shared.postId})
        </p>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`${baseBubble} ${bubbleColor}`}>
        {content}
        <p className="text-[10px] text-gray-200/80 mt-1 text-right">
          {msg.sender} · {timeStr}
        </p>
      </div>
    </div>
  );
}

/* ----------------------------- Page component ----------------------------- */

export default function ConversationPage() {
  const params = useParams();
  const userB = params?.id as string;

  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
        {
          sender: currentUser,
          receiver: userB,
          message: messageText,
          created_at: new Date(),
        },
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
        <div className="flex-1 overflow-y-auto border border-purple-700 rounded p-4 space-y-3">
          {loading ? (
            <p>Loading conversation...</p>
          ) : messages.length === 0 ? (
            <p className="text-gray-400">No messages yet.</p>
          ) : (
            messages.map((m, i) => (
              <MessageBubble
                key={i}
                msg={m}
                isOwn={m.sender === currentUser}
              />
            ))
          )}
        </div>

        {/* Input */}
        <div className="mt-3 border-t border-purple-700 pt-3 flex gap-2">
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