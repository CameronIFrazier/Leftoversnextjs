"use client";
import React, { useState, useEffect, useMemo } from "react";
import { FloatingDockDemo } from "../components/ui/FloatingDockDemo";

// Loading dots component
function LoadingDots() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}

interface Post {
  id: number;
  title: string;
  description: string;
  username?: string;
  avatar?: string | null;
  media_url?: string | null;
  created_at?: string;
}
export type Sponsor = {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  href?: string;
};
export type User = {
  name: string;
  handle?: string;
  avatarUrl?: string;
};
interface Comment {
  id: number;
  post_id: number;
  comment_text: string;
  parent_comment_id: number | null;
  created_at: string;
  username?: string | null;
  avatar?: string | null;
}

function pickRandomSponsors(list: Sponsor[], count = 3): Sponsor[] {
  // Deduplicate by id and pick a stable slice without mutating the input.
  // NOTE: Previously this function shuffled with Math.random(), which produced
  // different output between server and client and caused React hydration
  // mismatches. Return a deterministic selection (first N unique) instead.
  const unique = Array.from(new Map(list.map((s) => [s.id ?? s.name, s])).values());
  return unique.slice(0, Math.max(0, Math.min(count, unique.length)));
}

function MiniProfile({ user }: { user: User }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-black/40 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full border border-white/20">
          {/* Avatar */}
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-white/70">
              {user.name?.[0] ?? "?"}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{user.name}</div>
          {user.handle && (
            <div className="truncate text-xs text-white/60">@{user.handle}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function SponsorsList({ sponsors }: { sponsors: Sponsor[] }) {
  // Choose a deterministic initial set for SSR, then reshuffle on the client
  const initialThree = useMemo(() => pickRandomSponsors(sponsors, 3), [sponsors]);
  const [randomThree, setRandomThree] = React.useState<Sponsor[]>(initialThree);

  // Run only on client to reshuffle so each reload can show different sponsors
  React.useEffect(() => {
    // shuffle a fresh copy on the client
    const unique = Array.from(new Map(sponsors.map((s) => [s.id ?? s.name, s])).values());
    for (let i = unique.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unique[i], unique[j]] = [unique[j], unique[i]];
    }
    setRandomThree(unique.slice(0, Math.max(0, Math.min(3, unique.length))));
  }, [sponsors]);

  return (
    <div className="rounded-2xl border border-white/20 bg-black/40 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Featured Sponsors</h3>
        <span className="text-[10px] uppercase tracking-widest text-indigo-300/80">Random 3</span>
      </div>
      <ul className="space-y-3">
        {randomThree.map((s) => (
          <li key={s.id} className="group">
            <a
              href={s.href ?? "#"}
              className="flex items-center gap-3 rounded-xl border border-white/10 p-3 transition hover:border-indigo-400/50 hover:bg-white/5"
            >
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10">
                {s.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.logoUrl} alt={s.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-white/70">
                    {s.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-white">{s.name}</div>
                <div className="truncate text-xs text-white/60">{s.description}</div>
              </div>
            </a>
          </li>
        ))}
        {randomThree.length === 0 && (
          <li className="text-xs text-white/60">No sponsors found.</li>
        )}
      </ul>
    </div>
  );
}

function RightSidebar({ user, sponsors }: { user: User; sponsors: Sponsor[] }) {
  return (
    // inner aside should be full width of its parent column — width is controlled by the wrapper
    <aside className="sticky top-4 flex w-full flex-col gap-4">
      <MiniProfile user={user} />
      <SponsorsList sponsors={sponsors} />
    </aside>
  );
}

// Top-level, memoized CommentItem to avoid remounting on parent renders.
// It receives all handlers and lookup function as props to stay pure.
const CommentItem = React.memo(function CommentItemComponent({
  comment,
  postId,
  depth = 0,
  getReplies,
  replyingTo,
  setReplyingTo,
  replyInputs,
  setReplyInputs,
  handleReplySubmit,
}: {
  comment: Comment;
  postId: number;
  depth?: number;
  getReplies: (parentId: number) => Comment[];
  replyingTo: number | null;
  setReplyingTo: (id: number | null) => void;
  replyInputs: { [key: number]: string };
  setReplyInputs: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
  handleReplySubmit: (postId: number, parentId: number) => Promise<void>;
}) {
  const children = getReplies(comment.id);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Auto-focus the reply input when it becomes visible
  React.useEffect(() => {
    if (replyingTo === comment.id && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo, comment.id]);

  return (
    <div className={`bg-indigo-${800 - Math.min(depth * 50, 400)} rounded-lg p-2 mb-2`}>
      <div className="flex items-start gap-3">
        {comment.avatar ? (
          <img
            src={comment.avatar}
            alt={`${comment.username || "user"} avatar`}
            className={depth > 0 ? "w-6 h-6 rounded-full object-cover" : "w-8 h-8 rounded-full object-cover"}
          />
        ) : (
          <div
            className={
              depth > 0
                ? "w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs"
                : "w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm"
            }
          >
            @
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-gray-100">{comment.username ? `@${comment.username}` : "Unknown"}</div>
            {comment.created_at && <div className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</div>}
          </div>

          <div className="mt-1 text-white">{comment.comment_text}</div>

          <button type="button" onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="text-sm text-blue-400 hover:text-blue-300 mt-1">
            Reply
          </button>

          {replyingTo === comment.id && (
            <div className="mt-2 flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={replyInputs[comment.id] || ""}
                onChange={(e) => setReplyInputs((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                placeholder="Write a reply..."
                className="flex-grow rounded-lg p-2 text-indigo-200"
              />
              <button type="button" onClick={() => handleReplySubmit(postId, comment.id)} className="bg-indigo-600 hover:bg-gradient-to-b from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-lg">
                Send
              </button>
            </div>
          )}

          {children.length > 0 && (
            <div className="ml-5 mt-2 space-y-1">
              {children.map((child) => (
                <CommentItem key={child.id} comment={child} postId={postId} depth={depth + 1} getReplies={getReplies} replyingTo={replyingTo} setReplyingTo={setReplyingTo} replyInputs={replyInputs} setReplyInputs={setReplyInputs} handleReplySubmit={handleReplySubmit} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({});
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

   const user: User = {
    name: "Eric Lee",
    handle: "eric",
    avatarUrl: "/pfp.png",
  };


   const sponsors: Sponsor[] = [
    { id: "100t", name: "100 Thieves", description: "Gaming org based in LA", logoUrl: "/logos/100t.png", href: "/sponsors/100t" },
    { id: "liquid", name: "Team Liquid", description: "Global esports team", logoUrl: "/logos/tl.png", href: "/sponsors/team-liquid" },
    { id: "sentinels", name: "Sentinels", description: "Esports org from LA", logoUrl: "/logos/sen.png" },
    { id: "c9", name: "Cloud9", description: "Esports org from NA", logoUrl: "/logos/c9.png" },
    { id: "guard", name: "The Guard", description: "LA-based esports org" },
  ];
  // Fetch posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/getFeed");
        const data = await res.json();
        // Normalize incoming post objects to ensure we have a `username` and `avatar` field
        const normalized = (data || []).map((p: Record<string, unknown>) => {
          const id = typeof p["id"] === "number" ? (p["id"] as number) : Number(p["id"]);
          const title = p["title"] ? String(p["title"]) : "";
          const description = p["description"] ? String(p["description"]) : "";
          const media_url = (p["media_url"] ?? p["mediaUrl"] ?? null) as string | null;
          const created_at = (p["created_at"] ?? p["createdAt"] ?? null) as string | null;
          const username = (p["username"] ?? p["userName"] ?? p["user_name"] ?? p["name"] ?? null) as string | null;
          const avatar = (p["avatar"] ?? p["profile_pic"] ?? p["profilePic"] ?? null) as string | null;
          return { id, title, description, media_url, created_at, username, avatar };
        });

        setPosts(normalized);
      } catch (error) {
  
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Fetch current user's username (if logged in) so we can include it when posting comments
  useEffect(() => {
    async function fetchCurrentUserName() {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/getUserName', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data = await res.json();
        if (data.userName) setCurrentUserName(data.userName);
      } catch (err) {
        console.error('Failed to fetch current username:', err);
      }
    }
    fetchCurrentUserName();
  }, []);
//force
  // Fetch comments
  useEffect(() => {
    async function fetchComments() {
      const res = await fetch("/api/getComments");
      const data = await res.json();
      // Normalize comments to ensure username/avatar fields exist
      const normalized = (data || []).map((c: Record<string, unknown>) => {
        const id = typeof c["id"] === "number" ? (c["id"] as number) : Number(c["id"]);
        const post_id = typeof c["post_id"] === "number" ? (c["post_id"] as number) : Number(c["post_id"]);
        const comment_text = c["comment_text"] ? String(c["comment_text"]) : "";
        const parent_comment_id = c["parent_comment_id"] ?? c["parentCommentId"] ?? null;
        const created_at = (c["created_at"] ?? c["createdAt"] ?? null) as string | null;
        const username = (c["username"] ?? c["userName"] ?? null) as string | null;
        const avatar = (c["avatar"] ?? c["profile_pic"] ?? c["profilePic"] ?? null) as string | null;
        return { id, post_id, comment_text, parent_comment_id, created_at, username, avatar };
      });

      setComments(normalized);
    }
    fetchComments();
  }, []);

  // Submit a new top-level comment
  const handleCommentSubmit = async (postId: number) => {
    const comment = newComments[postId];
    if (!comment?.trim()) return;

    await addCommentToDB(postId, comment);
    setNewComments((prev) => ({ ...prev, [postId]: "" }));
  };

  // Submit a reply
  const handleReplySubmit = async (postId: number, parentId: number) => {
    const replyText = replyInputs[parentId];
    if (!replyText?.trim()) return;

    await addCommentToDB(postId, replyText, parentId);
    setReplyInputs((prev) => ({ ...prev, [parentId]: "" }));
    setReplyingTo(null);
  };

  // Helper: add comment/reply to DB and reload comments
  const addCommentToDB = async (postId: number, comment: string, parentCommentId: number | null = null) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      await fetch("/api/addComment", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ postId, comment, parentCommentId, username: currentUserName }),
      });

      // Reload comments and normalize them
      const fetched = await (await fetch("/api/getComments")).json();
      const normalized = (fetched || []).map((c: Record<string, unknown>) => {
        const id = typeof c["id"] === "number" ? (c["id"] as number) : Number(c["id"]);
        const post_id = typeof c["post_id"] === "number" ? (c["post_id"] as number) : Number(c["post_id"]);
        const comment_text = c["comment_text"] ? String(c["comment_text"]) : "";
        const parent_comment_id = c["parent_comment_id"] ?? c["parentCommentId"] ?? null;
        const created_at = (c["created_at"] ?? c["createdAt"] ?? null) as string | null;
        const username = (c["username"] ?? c["userName"] ?? null) as string | null;
        const avatar = (c["avatar"] ?? c["profile_pic"] ?? c["profilePic"] ?? null) as string | null;
        return { id, post_id, comment_text, parent_comment_id, created_at, username, avatar };
      });
      setComments(normalized);
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  // Filter top-level comments
  const getTopLevelComments = (postId: number) =>
    comments.filter((c) => c.post_id === postId && c.parent_comment_id === null);

  // Get replies for a comment
  const getReplies = (parentId: number) =>
    comments.filter((c) => c.parent_comment_id === parentId);

  

  return (
    <div className="h-full w-full flex justify-center bg-black text-white p-6 min-h-screen">
      {/**Left Side content */}
<aside className="hidden lg:flex lg:w-1/4">
        <div className="sticky top-4 w-full">
          <MiniProfile user={user} />
        </div>
      </aside>
      {/**Main feed Section */}
      <section className="h-auto w-[40%] mt-5 flex flex-col items-center justify-start bg-black p-8">
        <FloatingDockDemo></FloatingDockDemo>
        <h1 className="text-2xl font-bold mb-4 text-white">Feed</h1>

        <div className="w-full flex flex-col gap-4">
          {isLoading ? (
            <LoadingDots />
          ) : (
            posts.map((post) => (
            <div key={post.id} className="rounded-lg p-3 bg-indigo-900 text-white">
              <div className="flex items-center gap-3 mb-2">
                {post.avatar ? (
                  <img src={post.avatar} alt={`${post.username || 'user'} avatar`} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm">@</div>
                )}
                <div className="flex flex-col">
                  {post.username && <div className="text-sm text-gray-200">@{post.username}</div>}
                  {post.created_at && (
                    <div className="text-xs text-gray-400">{new Date(post.created_at).toLocaleString()}</div>
                  )}
                </div>
              </div>
              <h2 className="font-bold text-lg">{post.title}</h2>
              <p>{post.description}</p>

              {post.media_url && (
                <img src={post.media_url} alt="Post media" className="mt-2 rounded-lg" />
              )}

              {/* Comments Section */}
              <div className="mt-3">
                <h3 className="font-semibold mb-2">Comments</h3>

                {getTopLevelComments(post.id).length === 0 ? (
                  <p className="text-gray-300 text-sm">No comments yet.</p>
                ) : (
                  getTopLevelComments(post.id).map((c) => (
                    <CommentItem
                      key={c.id}
                      comment={c}
                      postId={post.id}
                      getReplies={getReplies}
                      replyingTo={replyingTo}
                      setReplyingTo={setReplyingTo}
                      replyInputs={replyInputs}
                      setReplyInputs={setReplyInputs}
                      handleReplySubmit={handleReplySubmit}
                    />
                  ))
                )}

                {/* Add Comment Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCommentSubmit(post.id);
                  }}
                  className="mt-3 flex gap-2 items-center"
                >
                  <input
                    type="text"
                    value={newComments[post.id] || ""}
                    onChange={(e) =>
                      setNewComments((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    placeholder="Write a comment..."
                    className="flex-grow rounded-lg p-2 text-white"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-gradient-to-b from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-lg"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          ))
          )}
        </div>
      </section>
      {/* Right Sidebar */}
       <aside className="hidden lg:flex lg:w-1/4">
        <RightSidebar user={user} sponsors={sponsors} />
      </aside>

    </div>
  );
}
