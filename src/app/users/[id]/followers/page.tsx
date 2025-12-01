"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function FollowersPage() {
    const { id } = useParams<{ id: string }>();
    const userId = String(id);
    const [followers, setFollowers] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            const headers = { Authorization: `Bearer ${token}` };
            const res = await fetch(`/api/getFollowers?userId=${userId}`, { headers });
            if (res.ok) {
                const data = await res.json();
                setFollowers(data.followers);
            }
        })();
    }, [userId]);

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <h1 className="text-2xl font-bold mb-4">Followers</h1>
            {followers.length === 0 ? (
                <p>No followers yet.</p>
            ) : (
                <ul className="space-y-2">
                    {followers.map((f) => (
                        <li key={f.id} className="border border-gray-700 p-3 rounded">
                            {f.username || f.userName || f.email}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
