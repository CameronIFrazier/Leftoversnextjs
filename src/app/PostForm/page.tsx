"use client"; 
import { useState } from "react";
//CURRENTLY UNUSED
interface Post {
  id: number;
  title: string;
  description: string;
  media_url?: string;
  created_at?: string;
}
export default function PostForm({ onPostCreated }: { onPostCreated: (post: Post) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<File | null>(null);

  const handleSubmit = async () => {
    // 1. Upload media first
    const media_url = media ? URL.createObjectURL(media) : null;
    if (media) {
      //media_url = await uploadToStorage(media); // implement your upload NOTHING FOR NOW
    }

    // 2. Send data to backend
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, media_url, user_id: 1 }),
    });

    const newPost = await res.json();

    // 3. Reset form
    setTitle("");
    setDescription("");
    setMedia(null);

    // 4. Notify parent so it can display the new post immediately
    onPostCreated(newPost);
  };

  return (
    <div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input type="file" onChange={(e) => e.target.files && setMedia(e.target.files[0])} />
      <button onClick={handleSubmit}>Create Post</button>
    </div>
  );
}
