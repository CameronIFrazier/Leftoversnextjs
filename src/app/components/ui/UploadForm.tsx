"use client";

import { useState } from "react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (data.url) {
      setUrl(data.url);
      console.log("Final Cloudinary URL:", data.url);
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-md">
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} />

      {preview && (
        file?.type.startsWith("video") ? (
          <video src={preview} controls className="w-64 rounded-md" />
        ) : (
          <img src={preview} className="w-64 rounded-md" />
        )
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-black text-white py-2 rounded"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {url && (
        <p className="text-green-500 break-words">
          Uploaded: {url}
        </p>
      )}
    </div>
  );
}
