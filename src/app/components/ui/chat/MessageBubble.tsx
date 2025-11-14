"use client";

import React from "react";

export type RawMessage = {
  id?: number;
  sender: string;
  receiver: string;
  message: string;
  created_at: string;
};

type SharedPostPayload = {
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

function tryParseSharedPost(message: string): SharedPostPayload | null {
  try {
    const parsed = JSON.parse(message);
    if (parsed && parsed.type === "shared_post" && parsed.post) {
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
    return null;
  } catch {
    return null;
  }
}

export function MessageBubble({
  msg,
  isOwn,
}: {
  msg: RawMessage;
  isOwn: boolean;
}) {
  const shared = tryParseSharedPost(msg.message);

  let content: React.ReactNode;
  if (shared) {
    const p = shared.post;
    content = (
      <div className="rounded-lg border border-white/15 bg-indigo-900/40 p-3 max-w-md">
        {shared.note && (
          <div className="text-sm text-gray-200 mb-2">{shared.note}</div>
        )}
        <div className="flex items-center gap-2 mb-2">
          {p.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.avatar}
              alt={p.username || "user"}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-xs">
              @
            </div>
          )}
          <div className="flex flex-col">
            {p.username && (
              <span className="text-sm font-semibold text-gray-100">
                {p.username}
              </span>
            )}
            {p.created_at && (
              <span className="text-[11px] text-gray-400">
                {new Date(p.created_at).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="text-sm font-semibold">{p.title}</div>
        <div className="text-sm text-gray-100 whitespace-pre-line">
          {p.description}
        </div>
        {p.media_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.media_url}
            alt="Post media"
            className="mt-2 rounded-md max-h-56 object-cover"
          />
        )}
      </div>
    );
  } else {
    content = (
      <div className="rounded-lg bg-white/10 px-3 py-2 max-w-md break-words">
        {msg.message}
      </div>
    );
  }

  return (
    <div
      className={`w-full flex mb-2 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      <div className="flex flex-col items-start max-w-[80%]">
        <span className="text-[11px] text-gray-500 mb-1">
          {msg.sender} &middot;{" "}
          {new Date(msg.created_at).toLocaleTimeString()}
        </span>
        {content}
      </div>
    </div>
  );
}
