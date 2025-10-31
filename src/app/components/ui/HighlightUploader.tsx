"use client";
import { useState } from "react";

export default function HighlightUploader() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("highlight", file);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/uploadHighlight", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert("Highlight uploaded!");
      } else {
        console.error("Upload failed:", data.error);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div>
      <input type="file" accept="video/mp4" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload Highlight</button>
    </div>
  );
}
