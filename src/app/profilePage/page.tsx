"use client";
import React, { useState, useEffect, use } from "react";
import { FloatingDockDemo } from "../components/ui/FloatingDockDemo";

export default function ProfilePage() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [highlight, setHighlight] = useState<string | null>(null);
  const [userName, setuserName] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]); // 🔹 NEW — store all posts
  const [title, setTitle] = useState(""); // 🔹 NEW — new post title
  const [description, setDescription] = useState(""); // 🔹 NEW — new post desc
  const [media, setMedia] = useState<File | null>(null); // 🔹 NEW — new post file
const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Fetch username
        const resUser = await fetch("/api/getUserName", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataUser = await resUser.json();
        if (dataUser.userName) setuserName(dataUser.userName);

        // Fetch profile picture
        const resPfp = await fetch("/api/getUserPfp", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataPfp = await resPfp.json();
        if (dataPfp.profilePic) setProfilePic(dataPfp.profilePic);

        // Fetch bio
        const resBio = await fetch("/api/getUserBio", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataBio = await resBio.json();
        if (dataBio.bio) setBio(dataBio.bio);

        // Fetch highlight
        const resHighlight = await fetch("/api/getUserHighlight", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataHighlight = await resHighlight.json();
        if (dataHighlight.highlight) setHighlight(dataHighlight.highlight);

        // 🔹 Fetch user posts
        if (dataUser.userName) {
          const resPosts = await fetch(
            `/api/getUserPosts?username=${dataUser.userName}`
          );
          const dataPosts = await resPosts.json();
          setPosts(dataPosts);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    }

    fetchUserData();
  }, []);

  // Save bio to backend
  const saveBio = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/updateBio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Bio updated!");
      } else {
        console.error("Failed to update bio:", data.error);
      }
    } catch (err) {
      console.error("Failed to save bio:", err);
    }
  };

  // 🔹 Create new post
  const handleCreatePost = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let media_url = null;

    // 🔹 Optional: temporary media handling (can later integrate real upload)
    if (media) {
      media_url = URL.createObjectURL(media); // local blob for now
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, media_url, username: userName, }),
      });

      const data = await res.json();

      if (data.success) {
        // Update post list immediately
        setPosts([
          { id: data.postId, title, description, media_url },
          ...posts,
        ]);
        // Reset form
        setTitle("");
        setDescription("");
        setMedia(null);
      } else {
        console.error("Failed to create post:", data.error);
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <section className="w-full flex flex-col items-center bg-black text-white">
      <section className="w-[70%] flex flex-row items-start justify-center pb-5 pt-5">
        {/* Left side */}
        <section className="w-[60%] h-auto pr-5">
          {/* Profile box */}
          <section className="w-full h-[400px] bg-cover bg-center flex flex-col p-4 items-center justify-center text-white border border-white rounded-lg bg-black-300">
            {userName ? (
              <h2 className="text-xl font-bold text-indigo-500 mb-2">
                @{userName}
              </h2>
            ) : (
              <p>Loading username...</p>
            )}
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile Picture"
                className="w-32 h-32 rounded-full border-2 border-white mb-4"
              />
            ) : (
              <p>Loading profile picture...</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("pfp", file);

                const token = localStorage.getItem("token");
                if (!token) return;

                fetch("/api/updatePfp", {
                  method: "POST",
                  headers: { Authorization: `Bearer ${token}` },
                  body: formData,
                })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.success) {
                      alert("Profile picture updated!");
                      setProfilePic(data.url);
                    } else {
                      console.error("Failed to update pfp:", data.error);
                    }
                  })
                  .catch((err) => console.error("Upload error:", err));
              }}
            />

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write your bio..."
              className="w-full p-2 border border-white rounded-lg text-white bg-indigo-900"
              rows={5}
            />
            <button
              onClick={saveBio}
              className="mt-2 px-4 py-2 bg-indigo-500 rounded hover:bg-indigo-600"
            >
              Save Bio
            </button>
          </section>

          {/* 🔹 Post Creation Section */}
          <section className="h-auto border border-white rounded-lg mt-5 flex flex-col p-4 bg-black">
            <h1 className="text-lg font-semibold mb-3">Create a New Post</h1>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title"
              className="w-full p-2 mb-2 border border-white rounded bg-indigo-900"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Post Description"
              className="w-full p-2 mb-2 border border-white rounded bg-indigo-900"
              rows={4}
            />
            <input
              type="file"
              onChange={(e) => e.target.files && setMedia(e.target.files[0])}
              className="mb-3"
            />
            <button
              onClick={handleCreatePost}
              className="px-4 py-2 bg-indigo-500 rounded hover:bg-indigo-600"
            >
              Create Post
            </button>
          </section>

          {/* 🔹 Past Posts Section */}
          <section className="h-auto border border-white rounded-lg mt-5 flex flex-col items-center justify-start bg-black p-4">
            <h1 className="text-lg font-semibold mb-4">Past Posts</h1>
            <div className="w-full flex flex-col gap-4">
              {posts.length === 0 ? (
                <p>No posts yet.</p>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="border border-indigo-500 rounded-lg p-3 bg-indigo-900"
                  >
                    <h2 className="font-bold">{post.title}</h2>
                    <p>{post.description}</p>
                    {post.media_url && (
                      <img
                        src={post.media_url}
                        alt="Post media"
                        className="mt-2 rounded-lg"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </section>

        {/* Right side */}
        <section className="w-[15%] h-auto bg-black flex flex-col">
          <section className="h-[1020px] border border-white rounded-lg flex flex-col items-center justify-start bg-black">
            <h1 className="mb-5">People You May Know</h1>
            <div className="w-[90%] h-[90%] bg-indigo-900 border border-white rounded-lg"></div>
          </section>
        </section>
      </section>

      <FloatingDockDemo />
    </section>
  );
}
