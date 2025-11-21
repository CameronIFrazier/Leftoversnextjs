"use client";
import React, { useState, useEffect, use } from "react";
import { FloatingDockDemo } from "../components/ui/FloatingDockDemo";
import LoadingDots from "../components/ui/LoadingDots";
import GradientBorder from "../components/ui/GradientBorder";
import { IconEdit, IconPhoto, IconTrash } from "@tabler/icons-react";
import UploadForm from "../components/ui/UploadForm";
interface Post {
  id: number;
  title: string;
  description: string;
   media_url?: string | null;
  created_at?: string;
   username?: string | null; 
  avatar?: string | null;   
}
//force redeploy
export default function ProfilePage() {
const [mediaPreview, setMediaPreview] = useState<string | null>(null); // Local preview
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [highlight, setHighlight] = useState<string | null>(null);
  const [userName, setuserName] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]); // 🔹 NEW — store all posts
  const [title, setTitle] = useState(""); // 🔹 NEW — new post title
  const [description, setDescription] = useState(""); // 🔹 NEW — new post desc
  const [media, setMedia] = useState<File | null>(null); // 🔹 NEW — new post file
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false); // 🔹 NEW — edit mode state
  const [toastMessage, setToastMessage] = useState<string | null>(null); // 🔹 NEW — toast notification
  const [toastVisible, setToastVisible] = useState(false); // 🔹 NEW — toast visibility for fade animation

  useEffect(() => {
    // Add click outside listener to turn off edit mode
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Don't exit edit mode if clicking on buttons or textarea
      if (target.closest('button') || 
          target.closest('textarea') || 
          target.closest('input[type="file"]')) {
        return;
      }
      
      // Exit edit mode for any other clicks
      setIsEditMode(false);
    };

    if (isEditMode) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditMode]);

  // Show toast notification for 5 seconds
  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
      // Remove the message after fade animation completes
      setTimeout(() => {
        setToastMessage(null);
      }, 500); // 500ms matches the transition duration
    }, 5000); // Start fading 300ms before the 5 second mark
  };

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
        showToast("Bio updated!");
        setIsEditMode(false); // Exit edit mode after successful save
      } else {
        console.error("Failed to update bio:", data.error);
      }
    } catch (err) {
      console.error("Failed to save bio:", err);
    }
  };


const handleUpload = async (file: File) => {
  try {
    const res = await fetch("/api/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, fileType: file.type }),
    });

    const { url, key } = await res.json();
    if (!url || !key) throw new Error("Failed to get signed URL");

    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    // Save S3 URL
    const publicUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    setMediaUrl(publicUrl);
    console.log("Uploaded to S3:", publicUrl);

  } catch (err) {
    console.error("Upload failed:", err);
    showToast("Upload failed: " + (err as Error).message);
  }
};



const handleCreatePost = async () => {
  if (!title || !userName) return;

  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description,
      userName,
      mediaUrl,
    }),
  });

  const data = await res.json();

  if (data.success) {
    console.log("Post created:", data.post);

    // 🔹 Immediately show the new post
    setPosts((prev) => [data.post, ...prev]);

    // Reset input fields
    setTitle("");
    setDescription("");
    setMediaUrl(null);

    showToast("Post created!");
  } else {
    console.error("Failed to create post:", data.error);
    showToast("Failed to create post.");
  }
};









  return (
    <section className="w-full flex flex-col items-center bg-black text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 bg-purple-400 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out transform ${
          toastVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
          {toastMessage}
        </div>
      )}

      <div className="sticky top-0 z-50 w-full bg-black backdrop-blur-md border-b border-gray-700 flex px-6 items-center justify-center">
        <FloatingDockDemo />
      </div>
      <section className="w-[98%] flex flex-row items-start justify-center pb-5 pt-5">
        {/* Left side */}
        <section className="w-[60%] h-auto pr-5">
          {/* Profile box */}
          <section className="profile-section w-full min-h-[400px] bg-cover bg-center flex flex-col p-4 items-center text-white rounded-lg bg-black-300">
            {userName ? (
              <h2 className="text-2xl font-bold bg-gradient-to-b from-indigo-500 to-purple-500 mb-4 pl-4 pr-4">
                Welcome back, {userName} 
              </h2>
            ) : (
              <p className="mb-4">Loading username...</p>
            )}
            
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile Picture"
                className="w-32 h-32 rounded-full mb-4"
              />
            ) : (
              <div className="mb-4">
                <LoadingDots />
              </div>
            )}

            {/* Edit button under avatar */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`mb-4 p-2 rounded-full transition-colors ${
                isEditMode 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white'
              }`}
              title={isEditMode ? "Exit edit mode" : "Edit profile"}
            >
              <IconEdit className="h-5 w-5" />
            </button>
            
            {/* Profile picture upload - only show in edit mode */}
            {isEditMode && (
              <div className="flex flex-col items-center gap-2 mb-4">
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="avatar-upload"
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
                          showToast("Profile picture updated!");
                          setProfilePic(data.url);
                        } else {
                          console.error("Failed to update pfp:", data.error);
                        }
                      })
                      .catch((err) => console.error("Upload error:", err));
                  }}
                />
                
                {/* Avatar Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Upload Avatar Button */}
                  <button
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    <IconPhoto className="h-5 w-5" />
                    Upload
                  </button>
                  
                  {/* Delete Avatar Button */}
                  {profilePic && (
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <IconTrash className="h-5 w-5" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Bio section */}
            {isEditMode ? (
              <>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write your bio..."
                  className="w-full p-2 rounded-lg text-white bg-indigo-900"
                  rows={5}
                />
                <button
                  onClick={saveBio}
                  className="mt-2 px-4 py-2 bg-indigo-500 rounded-xl hover:bg-gradient-to-b from-indigo-500 to-purple-500 text-white"
                >
                  Save Bio
                </button>
              </>
            ) : (
              <div className="w-full p-2 rounded-lg text-white bg-indigo-900/50 min-h-[100px] flex items-center justify-center">
                {bio || "No bio yet. Click the edit button to add one!"}
              </div>
            )}
          </section>

          {/* 🔹 Post Creation Section */}
          {/* 🔹 Post Creation Section */}
{/* 🔹 Post Creation Section */}
{/* 🔹 Post Creation Section */}
<section className="h-auto rounded-lg mt-5 flex flex-col p-4 bg-black">
  <h1 className="text-lg font-semibold mb-3">New Post</h1>

  {/* Title */}
  <input
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Title"
    className="w-full p-2 mb-2 rounded bg-indigo-900"
  />

  {/* Description */}
  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Description"
    className="w-full p-2 mb-2 rounded bg-indigo-900"
    rows={4}
  />

  {/* File Upload */}
  <input
    type="file"
    id="post-media-upload"
    className="hidden"
    accept="image/*,video/*"
    onChange={async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    // Read response as text first to avoid JSON parse errors
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Server returned non-JSON response: ${text}`);
    }

    if (data.success && data.media_url) {
      setMediaUrl(data.media_url);
      console.log("Upload successful:", data.media_url);
    } else {
      console.error("Upload failed:", data.error || "Unknown error");
    }
  } catch (err) {
    console.error("Upload error:", err);
  }
}}
  />

  {/* Upload Button */}
  <button
    onClick={() => document.getElementById("post-media-upload")?.click()}
    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors mb-3 w-fit"
  >
    <IconPhoto className="h-5 w-5" />
    {mediaUrl ? "Uploaded!" : "Upload Media"}
  </button>

  {/* Create Post Button */}
  <button
    onClick={handleCreatePost}
    className="mt-2 px-4 py-2 bg-indigo-500 rounded-xl hover:bg-gradient-to-b from-indigo-500 to-purple-500 text-white w-auto self-center"
  >
    Create Post
  </button>
</section>



              {/* Divider */}
            <div className="my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
          {/* 🔹 Past Posts Section */}
          <section className="w-[60%] mt-5">
        {posts && posts.length > 0 ? (
    posts.map((post) => {
      // Skip any undefined/null posts just in case
      if (!post) return null;

      const { id, title, description, media_url } = post;

      return (
        <div key={id} className="p-3 bg-indigo-900 rounded-lg mb-3">
          <h2 className="font-bold">{title || "Untitled Post"}</h2>
          <p>{description || ""}</p>

          {media_url && (
            media_url.endsWith(".mp4") ? (
              <video controls className="mt-2 rounded-lg w-full">
                <source src={media_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={media_url} alt={title || "Post media"} className="mt-2 rounded-lg w-full" />
            )
          )}
        </div>
      );
    })
  ) : (
    <p className="text-gray-400">No posts yet.</p>
  )}
      </section>
        </section>

        {/* Right side */}
        <section className="w-[20%] h-auto bg-black flex flex-col">
          <GradientBorder>
            <section className="h-[1020px] rounded-lg flex flex-col items-center justify-start bg-black p-4">
              <h1 className="mb-5 text-purple-300 font-bold">People you may know</h1>
              <div className="w-[90%] h-[90%] bg-indigo-900 rounded-lg"></div>
            </section>
          </GradientBorder>
        </section>
      </section>
    </section>
  );
}