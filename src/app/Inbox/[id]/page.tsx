"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type ThreadMessage = {
  id: string;
  from: string;
  body: string;
  time?: string;
  media?: {
    type: 'image' | 'video' | 'file';
    url: string;
    filename: string;
  };
};

// Example threads keyed by conversation id. In a real app this would be loaded from the server.
const THREADS: Record<string, ThreadMessage[]> = {
  "1": [
    { id: "1-1", from: "Avery Park", body: "Hey! I saw your latest post and had a quick question about your gameplay.", time: "10:12am" },
    { id: "1-2", from: "You", body: "Sure — what do you have in mind?", time: "10:15am" },
  ],
  "2": [
    { id: "2-1", from: "Leftovers Team", body: "Welcome to your inbox. Click anywhere on a message to reply.", time: "9:00am" },
    { id: "2-2", from: "You", body: "Thanks — happy to be here!", time: "9:05am" },
  ],
  "3": [
    { id: "3-1", from: "Samir Patel", body: "Are you still looking for sponsors for your next write-up?", time: "Yesterday" },
  ],
};

const PARTICIPANTS: Record<string, string> = {
  "1": "Avery Park",
  "2": "Leftovers Team",
  "3": "Samir Patel",
};

export default function ConversationPage({ params }: { params: any }) {
  const router = useRouter();
  // In recent Next.js versions `params` may be a Promise that must be unwrapped
  // with `React.use(params)` from the server boundary. Use it when available,
  // otherwise fall back to the plain object for compatibility.
  let id: string;
  try {
    const maybeUse = (React as any).use;
    if (typeof maybeUse === "function") {
      const unwrapped = (React as any).use(params);
      id = unwrapped?.id ?? params?.id;
    } else {
      id = params?.id;
    }
  } catch (err) {
    // Fallback if React.use is not available or unwrapping fails
    id = params?.id;
  }
  const [thread, setThread] = useState<ThreadMessage[]>([]);
  const [text, setText] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`/api/messages/${id}`);
        const data = await res.json();
        if (mounted && data && data.success) {
          setThread(data.messages ?? []);
          return;
        }
      } catch (err) {
        // ignore and fall back to mock
      }

      // fallback to local mock
      setThread(THREADS[id] ?? []);
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  // derive the participant name from the loaded thread if possible
  const participantName = (() => {
    // prefer the first message sender that is not 'You'
    const other = thread.find((m) => m.from && m.from !== "You");
    if (other) return other.from;
    // fallback to known participants map
    return PARTICIPANTS[id] ?? undefined;
  })();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
    }
  };

  const uploadMedia = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      return data.url;
    } finally {
      setIsUploading(false);
    }
  };

  const send = async () => {
    if (!text.trim() && !mediaFile) return;
    
    let mediaData;
    if (mediaFile) {
      try {
        const url = await uploadMedia(mediaFile);
        const type = mediaFile.type.startsWith('image/') ? 'image' as const : 
                    mediaFile.type.startsWith('video/') ? 'video' as const : 
                    'file' as const;
        mediaData = {
          type,
          url,
          filename: mediaFile.name
        };
      } catch (err) {
        console.error('Failed to upload media:', err);
        alert('Failed to upload media. Please try again.');
        return;
      }
    }

    const newMsg: ThreadMessage = { 
      id: Date.now().toString(), 
      from: "You", 
      body: text.trim(), 
      time: "now",
      ...(mediaData && { media: mediaData })
    };

    setThread((t) => [...t, newMsg]);
    setText("");
    setMediaFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: id, message: newMsg }),
      });
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <section className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <button className="text-sm text-purple-300 mb-4" onClick={() => router.back()}>&larr; Back</button>
  <h2 className="text-2xl font-bold mb-4">Conversation — {PARTICIPANTS[id] ?? `#${id}`}</h2>

        <div className="space-y-4 mb-8">
          {thread.map((m) => (
            <div key={m.id} className={`p-3 rounded-md ${m.from === 'You' ? 'bg-purple-800 self-end' : 'bg-indigo-900'}`}>
              <div className="text-sm font-semibold text-purple-200">{m.from}</div>
              {m.body && <div className="mt-1 text-sm text-purple-100">{m.body}</div>}
              {m.media && (
                <div className="mt-2">
                  {m.media.type === 'image' && (
                    <img 
                      src={m.media.url} 
                      alt={m.media.filename}
                      className="max-w-sm rounded-md"
                    />
                  )}
                  {m.media.type === 'video' && (
                    <video 
                      src={m.media.url}
                      controls
                      className="max-w-sm rounded-md"
                    />
                  )}
                  {m.media.type === 'file' && (
                    <a 
                      href={m.media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-indigo-800/50 rounded-md hover:bg-indigo-700/50 transition-colors"
                    >
                      📎 {m.media.filename}
                    </a>
                  )}
                </div>
              )}
              <div className="text-xs text-purple-400 mt-1">{m.time}</div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-4 left-0 right-0 bg-black/80 p-4 border-t border-purple-600">
          <div className="max-w-3xl mx-auto space-y-2">
            {mediaFile && (
              <div className="flex items-center gap-2 p-2 bg-indigo-900/50 rounded-md">
                <div className="flex-1 truncate text-sm">
                  {mediaFile.name}
                </div>
                <button 
                  onClick={() => {
                    setMediaFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-purple-300 hover:text-purple-100"
                >
                  ✕
                </button>
              </div>
            )}
            
            <div className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <textarea 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  className="flex-1 rounded-md p-2 bg-indigo-900 text-white" 
                  rows={2}
                  placeholder="Type your message..."
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 bg-indigo-800 rounded-md hover:bg-indigo-700 transition-colors"
                  title="Attach file"
                >
                  📎
                </button>
              </div>
              <button 
                onClick={send} 
                disabled={isUploading || (!text.trim() && !mediaFile)} 
                className={`px-4 py-2 bg-purple-600 rounded-md transition-colors ${
                  isUploading || (!text.trim() && !mediaFile) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-purple-500'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
