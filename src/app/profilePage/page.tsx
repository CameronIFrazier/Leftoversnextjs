// app/successPage/page.tsx
"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GlowingEffectDemo } from "../components/ui/GlowingEffectDemo";
import { FloatingDockDemo } from "../components/ui/FloatingDockDemo";

export default function ProfilePage() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [highlight, setHighlight] = useState<string | null>(null);
  const [newHighlight, setNewHighlight] = useState("");
  const [userName, setuserName] = useState<string | null>(null);
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

      // Existing fetches
      const resPfp = await fetch("/api/getUserPfp", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataPfp = await resPfp.json();
      if (dataPfp.profilePic) setProfilePic(dataPfp.profilePic);

      const resBio = await fetch("/api/getUserBio", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataBio = await resBio.json();
      if (dataBio.bio) setBio(dataBio.bio);

      const resHighlight = await fetch("/api/getUserHighlight", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataHighlight = await resHighlight.json();
      if (dataHighlight.highlight) setHighlight(dataHighlight.highlight);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  }

  fetchUserData();
}, []);

  const saveHighlight = async (newUrl: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/updateHighlight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ highlight: newUrl }),
      });
      const data = await res.json();
      if (data.success) alert("Highlight updated!");
    } catch (err) {
      console.error("Failed to update highlight:", err);
    }
  };

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

  return (
    <section className="w-full flex flex-col items-center bg-black text-white   ">
      
      <section className="w-[70%] flex flex-row items-start justify-center pb-5 pt-5">
        {" "}
        {/** Main container */}
        <section className="w-[60%] h-auto pr-5  ">
          {" "}
          {/** Left side */}
          <section className="w-full h-[400px] bg-cover bg-center flex flex-col p-4 items-center justify-center text-white border border-white rounded-lg bg-indigo-500">
            {userName ? (
  <h2 className="text-xl font-bold mb-2">@{userName}</h2>
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
                      setProfilePic(data.url); // update immediately on screen
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
          <section className="h-[600px] border border-white bg-indigo-900 rounded-lg mt-5 flex flex-col items-center justify-center">
            <h1 className=""> Past Posts</h1>

            <div className="mt-4 flex flex-col bg-indigo-500"></div>
          </section>
        </section>
        <section className="w-[15%] h-auto bg-black flex flex-col">
          {" "}
          {/** Right side */}
          
          <section className="h-[1020px] border border-white rounded-lg flex flex-col items-center bg-indigo-500 justify-start">
            <h1 className="mb-5">People You May Know</h1>{" "}
            <div className="w-[90%] h-[90%] bg-indigo-900 border border-white rounded-lg"></div>
          </section>
        </section>
      </section>

      <div className="">
        <FloatingDockDemo></FloatingDockDemo>
      </div>
    </section>
  );
}
