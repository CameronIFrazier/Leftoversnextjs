"use client";
/// <reference types="react" />
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FloatingDockDemo } from "../components/ui/FloatingDockDemo";
import { LoadingDots } from "../components/ui/LoadingDots";
import { PeopleYouMayKnow } from "../components/ui/PeopleYouMayKnow";
import { SponsorsList } from "../components/ui/SponsorsList";

interface Post {
  id: number;
  title: string;
  description: string;
  username?: string;
  avatar?: string | null;
  media_url?: string | null;
  created_at?: string;
}
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

// function pickRandomSponsors(list: Sponsor[], count = 3): Sponsor[] {
//   // Deduplicate by id and pick a stable slice without mutating the input.
//   // NOTE: Previously this function shuffled with Math.random(), which produced
//   // different output between server and client and caused React hydration
//   // mismatches. Return a deterministic selection (first N unique) instead.
//   const unique = Array.from(new Map(list.map((s) => [s.id ?? s.name, s])).values());
//   return unique.slice(0, Math.max(0, Math.min(count, unique.length)));
// }

function SearchBox() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed.length > 0) {
      router.push(`/search?query=${encodeURIComponent(trimmed)}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="rounded-2xl border border-white/20 bg-black/40 p-4 shadow-sm">
      <form onSubmit={handleSearch} className="w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full bg-transparent border border-gray-600 rounded-xl px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-purple-400 transition-colors duration-200"
        />
      </form>
    </div>
  );
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

function RightSidebar({ user }: { user: User }) {
  return (
    // inner aside should be full width of its parent column — width is controlled by the wrapper
    <aside className="sticky top-24 flex w-full flex-col gap-4 pb-10">
      <SearchBox />
      <MiniProfile user={user} />
      <SponsorsList />
      <PeopleYouMayKnow />
    </aside>
  );
}

// Top-level, memoized CommentItem to avoid remounting on parent renders.
// It receives all handlers and lookup function as props to stay pure.
interface CommentItemProps {
  comment: Comment;
  postId: number;
  depth?: number;
  getReplies: (parentId: number) => Comment[];
  replyingTo: number | null;
  setReplyingTo: (id: number | null) => void;
  replyInputs: { [key: number]: string };
  setReplyInputs: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
  handleReplySubmit: (postId: number, parentId: number) => Promise<void>;
  // Allow React `key` attribute to be passed in JSX without type errors
  key?: React.Key;
}

function CommentItemComponent({
  comment,
  postId,
  depth = 0,
  getReplies,
  replyingTo,
  setReplyingTo,
  replyInputs,
  setReplyInputs,
  handleReplySubmit,
}: CommentItemProps) {
  const children = getReplies(comment.id);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Auto-focus the reply input when it becomes visible
  React.useEffect(() => {
    if (replyingTo === comment.id && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo, comment.id]);

  return (
    <div className={`${depth > 0 ? 'border-l-2 border-l-indigo-400 pl-4 ml-2' : ''} rounded-lg p-2 mb-2`}>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReplyInputs((prev: { [key: number]: string }) => ({ ...prev, [comment.id]: e.target.value }))}
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
              {children.map((child: Comment) => (
                <CommentItem key={child.id} comment={child} postId={postId} depth={depth + 1} getReplies={getReplies} replyingTo={replyingTo} setReplyingTo={setReplyingTo} replyInputs={replyInputs} setReplyInputs={setReplyInputs} handleReplySubmit={handleReplySubmit} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
const CommentItem = React.memo(CommentItemComponent) as React.MemoExoticComponent<React.FC<CommentItemProps>>;
export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({});
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Current logged-in user — will be populated from JWT-protected endpoints when available
  const [user, setUser] = useState<User>({ name: "Guest", handle: undefined, avatarUrl: undefined });

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
  // Fetch current user's username and profile picture (if logged in)
  useEffect(() => {
    async function fetchCurrentUserProfile() {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // fetch username
        const nameRes = await fetch('/api/getUserName', { headers: { Authorization: `Bearer ${token}` } });
        if (nameRes.ok) {
          const nameData = await nameRes.json();
          if (nameData.userName) {
            setCurrentUserName(nameData.userName);
            setUser((prev: User) => ({ ...prev, name: nameData.userName }));
          }
        }

        // fetch profile picture
        const pfpRes = await fetch('/api/getUserPfp', { headers: { Authorization: `Bearer ${token}` } });
        if (pfpRes.ok) {
          const pfpData = await pfpRes.json();
          // server returns { profilePic: ... }
          if (pfpData && pfpData.profilePic) {
            setUser((prev: User) => ({ ...prev, avatarUrl: pfpData.profilePic }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch current user profile:', err);
      }
    }

    fetchCurrentUserProfile();
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
    setNewComments((prev: { [key: number]: string }) => ({ ...prev, [postId]: "" }));
  };

  // Submit a reply
  const handleReplySubmit = async (postId: number, parentId: number) => {
    const replyText = replyInputs[parentId];
    if (!replyText?.trim()) return;

    await addCommentToDB(postId, replyText, parentId);
    setReplyInputs((prev: { [key: number]: string }) => ({ ...prev, [parentId]: "" }));
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
    comments.filter((c: Comment) => c.post_id === postId && c.parent_comment_id === null);

  // Get replies for a comment
  const getReplies = (parentId: number) =>
    comments.filter((c: Comment) => c.parent_comment_id === parentId);

  

  return (
    <div className="h-full w-full bg-black text-white min-h-screen">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 w-full bg-black/95 border-b border-gray-700 flex px-6 items-center justify-between mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 inline-block pr-54 pl-4">Feed Page</h1>
            
            <FloatingDockDemo />
      </div>
      
      {/* Main Content */}
      <div className="flex justify-center p-6 pt-6">      
        {/**Main feed Section */}
        <section className="w-[60%] flex flex-col items-center justify-start bg-black">
          <div className="w-full flex flex-col gap-4">
          {isLoading ? (
            <LoadingDots />
          ) : (
            posts.map((post) => (
            <div key={post.id} className="rounded-lg border border-gray-700 p-4 mb-6">
              {/* Post Content */}
              <div className="rounded-lg p-3 bg-indigo-900 text-white mb-3">
                <div className="flex items-center gap-3 mb-2">
                  {post.avatar ? (
                    <img src={post.avatar} alt={`${post.username || 'user'} avatar`} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm">@</div>
                  )}
                  <div className="flex flex-col">
                    {post.username && <div className="text-base text-gray-200 font-bold">{post.username}</div>}
                    {post.created_at && (
                      <div className="text-xs text-gray-400">{new Date(post.created_at).toLocaleString()}</div>
                    )}
                  </div>
                </div>
                <h2 className="font-bold text-base">{post.title}</h2>
                <p className="text-sm text-gray-200">{post.description}</p>

                {post.media_url && (
                  <img src={post.media_url} alt="Post media" className="mt-2 rounded-lg" />
                )}
              </div>

              {/* Comments Section */}
              <div className="mt-3"> 
                <h3 className="font-semibold mb-2">Comments</h3>

                {getTopLevelComments(post.id).length === 0 ? (
                  <p className="text-gray-300 text-sm">No comments yet.</p>
                ) : (
                  getTopLevelComments(post.id).map((c: Comment) => (
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
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    handleCommentSubmit(post.id);
                  }}
                  className="mt-3 flex gap-2 items-center"
                >
                  <input
                    type="text"
                    value={newComments[post.id] || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewComments((prev: { [key: number]: string }) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    placeholder="Write a comment..."
                    className="flex-grow rounded-lg p-2 text-white bg-indigo-800/30 focus:outline-none focus:border-indigo-400"
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
        <aside className="hidden lg:flex lg:w-1/4 pl-10 sticky top-24 self-start">
          <RightSidebar user={user} />
        </aside>
      </div>
    </div>
  );
}
