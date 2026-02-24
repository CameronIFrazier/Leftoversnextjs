"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { FloatingDockDemo } from "@/app/components/ui/FloatingDockDemo";
import LoadingDots from "@/app/components/ui/LoadingDots";
import { SponsorsList } from "@/app/components/ui/SponsorsList";
import { PeopleYouMayKnow } from "@/app/components/ui/PeopleYouMayKnow";

type UserCore = {
  id: number;
  userName?: string | null;
  username?: string | null;
  email?: string | null;
  profile_pic_url?: string | null;
};

type UserBio = {
  bio?: string | null;
  profile_pic?: string | null;
  profile_pic_url?: string | null;
};

type Post = {
  id: number;
  title?: string | null;
  description?: string | null;
  media_url?: string | null;
  created_at?: string | null;
};

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const userId = String(id);
  const router = useRouter();

  const [user, setUser] = useState<UserCore | null>(null);
  const [bio, setBio] = useState<UserBio | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const token = localStorage.getItem("token") || localStorage.getItem("jwt") || localStorage.getItem("authToken");
        if (!token) throw new Error("Not signed in.");

        const headers = { Authorization: `Bearer ${token}` };

        const [uRes, bRes, pRes] = await Promise.all([
          fetch(`/api/getUserNameById?userId=${userId}`, { headers, cache: "no-store" }),
          fetch(`/api/getUserBioById?userId=${userId}`, { headers, cache: "no-store" }),
          fetch(`/api/getUserPostsById?userId=${userId}`, { headers, cache: "no-store" }),
        ]);

        if (!alive) return;

        const [u, b, p] = await Promise.all([uRes.json(), bRes.json(), pRes.json()]);

        console.log("User data:", u);
        console.log("Bio data:", b);
        console.log("Posts data:", p);

        setUser(u);
        setBio(b);
        setPosts(Array.isArray(p) ? p : []);
      } catch (e: any) {
        console.error(e);
        if (alive) setErr(e?.message ?? "Failed to load profile.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [userId]);

  const avatarUrl = useMemo(() => {
    const url = bio?.profile_pic || bio?.profile_pic_url || user?.profile_pic_url;
    return url && url.trim() !== "" ? url : null;
  }, [bio, user]);

  const displayName = useMemo(() => {
    return (user?.userName ?? user?.username ?? "User").toString();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingDots />
          <p className="text-gray-400 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (err || !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <p className="text-red-400">{err ?? "User not found."}</p>
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-white transition-colors mt-2">
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col items-center bg-black text-white min-h-screen">

      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 w-full bg-black/95 border-b border-gray-700 flex px-6 items-center justify-between mb-6">
        <div className="flex items-center gap-3 pl-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors group"
          >
            <IconArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 inline-block">
            {displayName}'s Profile
          </h1>
        </div>
        <FloatingDockDemo />
      </div>

      <section className="w-[98%] flex flex-row items-start justify-center pb-5 pt-5">

        {/* Left side */}
        <section className="w-[60%] h-auto pr-5">

          {/* Profile box */}
          <section className="w-full min-h-[400px] flex flex-col p-4 items-center text-white rounded-lg bg-black">

            <h2 className="text-2xl font-bold bg-gradient-to-b from-indigo-500 to-purple-500 mb-4 pl-4 pr-4">
              {displayName}
            </h2>

            {/* Avatar */}
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${displayName}'s profile picture`}
                className="w-32 h-32 rounded-full object-cover mb-4 ring-2 ring-indigo-500/40"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold text-4xl mb-4 ring-2 ring-indigo-500/40">
                {displayName[0]?.toUpperCase() ?? "U"}
              </div>
            )}

            {/* Bio */}
            <div className="w-full p-2 rounded-lg text-white bg-indigo-900/50 min-h-[100px] flex items-center justify-center">
              {bio?.bio?.trim() || "This user hasn't added a bio yet."}
            </div>
          </section>

          {/* Posts */}
          <section className="w-full mt-5">
            <h2 className="text-lg font-semibold mb-3 pl-1">Posts</h2>

            {posts.length === 0 ? (
              <p className="text-gray-400">No posts yet.</p>
            ) : (
              posts.map((post) => {
                if (!post) return null;
                const { id, title, description, media_url } = post;

                return (
                  <div key={id} className="p-3 bg-indigo-900 rounded-lg mb-3">
                    <h3 className="font-bold">{title || "Untitled Post"}</h3>
                    <p className="text-gray-300 text-sm mt-1">{description || ""}</p>

                    {media_url && (
                      /\.(mp4|mov|webm|ogg)$/i.test(media_url) ? (
                        <div className="relative mt-2 w-full">
                          {videoLoading[id] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg z-10">
                              <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full" />
                            </div>
                          )}
                          <video
                            controls
                            className="rounded-lg w-full"
                            onWaiting={() => setVideoLoading((prev) => ({ ...prev, [id]: true }))}
                            onCanPlayThrough={() => setVideoLoading((prev) => ({ ...prev, [id]: false }))}
                            onLoadedData={() => setVideoLoading((prev) => ({ ...prev, [id]: false }))}
                          >
                            <source src={media_url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ) : (
                        <img
                          src={media_url}
                          alt={title || "Post media"}
                          className="mt-2 rounded-lg w-full"
                        />
                      )
                    )}

                    {post.created_at && (
                      <p className="text-xs text-gray-500 mt-2">{timeAgo(post.created_at)}</p>
                    )}
                  </div>
                );
              })
            )}
          </section>
        </section>

        {/* Right side */}
        <section className="w-[20%] h-auto bg-black flex flex-col gap-4">
          <SponsorsList />
          <PeopleYouMayKnow />
        </section>

      </section>
    </section>
  );
}