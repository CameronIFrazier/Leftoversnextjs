"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type UserCore = {
  id: number;
  userName?: string | null;
  username?: string | null;
  email?: string | null;
  profile_pic_url?: string | null;
};

type UserBio = {
  bio?: string | null;
  profile_pic_url?: string | null;
};

type Post = {
  id: number;
  title?: string | null;
  description?: string | null;
  media_url?: string | null;
  created_at?: string | null;
};

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const userId = String(id);

  const [user, setUser] = useState<UserCore | null>(null);
  const [bio, setBio] = useState<UserBio | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);

    const getLoggedInUserEmail = (): string | null => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
            const decoded: any = jwtDecode(token);
            console.log("Decoded token payload:", decoded); // check payload
            return decoded.email || null; // ✅ use email instead of id
        } catch (err) {
            console.error("Failed to decode token:", err);
            return null;
        }
    };



    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            const headers = { Authorization: `Bearer ${token}` };
            const fRes = await fetch(`/api/getFollowers?userId=${userId}`, { headers });
            if (fRes.ok) {
                const data = await fRes.json();
                setFollowersCount(data.followers.length);

                const loggedInUserEmail = getLoggedInUserEmail();
                if (loggedInUserEmail) {
                    setIsFollowing(data.followers.some((f: any) => f.email === loggedInUserEmail));
                }
            }
        })();
    }, [userId]);

    useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("jwt") ||
          localStorage.getItem("authToken");

        if (!token) throw new Error("Not signed in. Missing Authorization token.");

        const headers = { Authorization: `Bearer ${token}` };

        const [uRes, bRes, pRes] = await Promise.all([
          fetch(`/api/getUserNameById?userId=${userId}`, { headers, cache: "no-store" }),
          fetch(`/api/getUserBioById?userId=${userId}`, { headers, cache: "no-store" }),
          fetch(`/api/getUserPostsById?userId=${userId}`, { headers, cache: "no-store" }),
        ]);

        if (!alive) return;

        if (!uRes.ok || !bRes.ok || !pRes.ok) {
          throw new Error(`Failed to load user data: ${uRes.status}, ${bRes.status}, ${pRes.status}`);
        }

        const [u, b, p] = await Promise.all([uRes.json(), bRes.json(), pRes.json()]);

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

    return () => {
      alive = false;
    };
  }, [userId]);

  const avatarUrl = useMemo(
    () => bio?.profile_pic_url || user?.profile_pic_url || "",
    [bio?.profile_pic_url, user?.profile_pic_url]
  );


  const displayName = useMemo(() => {
    return (user?.userName ?? user?.username ?? "User").toString();
  }, [user?.userName, user?.username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading profile…</p>
      </div>
    );
  }

  if (err || !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-400">{err ?? "User not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl font-bold">
            {avatarUrl ? (
              <img src={avatarUrl} alt={`${displayName} profile`} className="h-full w-full object-cover" />
            ) : (
              (displayName[0]?.toUpperCase() ?? "U")
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-sm text-purple-300">@{displayName}</p>
            {user.email && <p className="text-sm text-gray-400">{user.email}</p>}
          </div>
        </div>

          <button
              onClick={async () => {
                  const loggedInUserEmail = getLoggedInUserEmail();
                  if (!loggedInUserEmail) {
                      console.error("No email found in token");
                      return;
                  }

                  const payload = {
                      followerEmail: loggedInUserEmail,
                      followingId: Number(userId),
                  };


                  try {
                      const res = await fetch("/api/follow", {
                          method: isFollowing ? "DELETE" : "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(payload),
                      });

                      const data = await res.json();
                      if (!data.success) {
                          console.error("Follow API failed:", data.error);
                          return;
                      }

                      setIsFollowing(!isFollowing);
                      setFollowersCount((c) => (isFollowing ? c - 1 : c + 1));
                  } catch (err) {
                      console.error("Follow/unfollow request failed:", err);
                  }
              }}
              className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
          >
              {isFollowing ? "Unfollow" : "Follow"}
          </button>



          <p className="text-sm text-gray-400">{followersCount} followers</p>


          {/* Bio */}
        <div className="border border-gray-800 rounded-2xl p-5 mb-8 bg-[#0b0b0b]">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-gray-300">{bio?.bio?.trim() || "This user hasn’t added a bio yet."}</p>
        </div>

        {/* Posts */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-400">No posts yet.</p>
          ) : (
            <ul className="space-y-4">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="border border-gray-800 rounded-2xl p-5 bg-[#0b0b0b] hover:border-purple-400 transition-colors"
                >
                  {post.title && <h3 className="font-semibold mb-1">{post.title}</h3>}
                  {post.description && <p className="text-gray-300 whitespace-pre-wrap">{post.description}</p>}
                  {post.media_url && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-gray-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.media_url} alt="" className="w-full object-cover" />
                    </div>
                  )}
                  {post.created_at && (
                    <p className="mt-2 text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
