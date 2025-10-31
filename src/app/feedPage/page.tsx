"use client";
import React, { useState, useEffect } from "react";

interface Post {
  id: number;
  title: string;
  description: string;
  username?: string;
  avatar?: string | null;
  media_url?: string | null;
  created_at?: string;
}

interface Comment {
  id: number;
  post_id: number;
  comment_text: string;
  parent_comment_id: number | null;
  created_at: string;
  username?: string | null;
  avatar?: string | null;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({});
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  // Fetch posts
  useEffect(() => {
    async function fetchPosts() {
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
    <div className="h-full w-full flex flex-col items-center justify-start bg-black">
      <section className="h-auto w-[40%] mt-5 flex flex-col items-center justify-start bg-black p-4">
        <h1 className="text-2xl font-bold mb-4 text-white">Posts History</h1>

        <div className="w-full flex flex-col gap-4">
          {posts.map((post) => (
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
                  getTopLevelComments(post.id).map((comment) => (
                    <div key={comment.id} className="bg-indigo-800 rounded-lg p-2 mb-2">
                      <div className="flex items-start gap-3">
                        {comment.avatar ? (
                          <img src={comment.avatar} alt={`${comment.username || 'user'} avatar`} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm">@</div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold text-gray-100">{comment.username ? `@${comment.username}` : 'Unknown'}</div>
                            {comment.created_at && (
                              <div className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</div>
                            )}
                          </div>
                          <div className="mt-1 text-white">{comment.comment_text}</div>

                          {/* Reply button */}
                          <button
                            onClick={() =>
                              setReplyingTo(replyingTo === comment.id ? null : comment.id)
                            }
                            className="text-sm text-blue-400 hover:text-blue-300 mt-1"
                          >
                            Reply
                          </button>

                          {/* Reply input */}
                          {replyingTo === comment.id && (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleReplySubmit(post.id, comment.id);
                              }}
                              className="mt-2 flex gap-2 items-center"
                            >
                              <input
                                type="text"
                                value={replyInputs[comment.id] || ""}
                                onChange={(e) =>
                                  setReplyInputs((prev) => ({
                                    ...prev,
                                    [comment.id]: e.target.value,
                                  }))
                                }
                                placeholder="Write a reply..."
                                className="flex-grow rounded-lg p-2 text-black"
                              />
                              <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
                              >
                                Send
                              </button>
                            </form>
                          )}

                          {/* Replies */}
                          <div className="ml-5 mt-2 space-y-1">
                            {getReplies(comment.id).map((reply) => (
                              <div
                                key={reply.id}
                                className="bg-indigo-700 rounded-lg p-2 text-sm"
                              >
                                <div className="flex items-start gap-2">
                                  {reply.avatar ? (
                                    <img src={reply.avatar} alt={`${reply.username || 'user'} avatar`} className="w-6 h-6 rounded-full object-cover" />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs">@</div>
                                  )}
                                  <div>
                                    <div className="text-sm font-semibold">{reply.username ? `@${reply.username}` : 'Unknown'}</div>
                                    <div className="text-xs text-gray-300">{reply.comment_text}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
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
                    className="flex-grow rounded-lg p-2 text-black"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
