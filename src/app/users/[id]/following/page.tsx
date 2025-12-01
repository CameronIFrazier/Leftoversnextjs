"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function FollowingPage() {
    const { id } = useParams<{ id: string }>();
    const userId = String(id);
    const [following, setFollowing] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            const headers = { Authorization: `Bearer ${token}` };
            const res = await fetch(`/api/getFollowing?userId=${userId}`, { headers });
            if (res.ok) {
                const data = await res.json();
                setFollowing(data.following);
            }
        })();
    }, [userId]);

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <h1 className="text-2xl font-bold mb-4">Following</h1>
            {following.length === 0 ? (
                <p>Not following anyone yet.</p>
            ) : (
                <ul className="space-y-2">
                    {following.map((f) => (
                        <li key={f.id} className="border border-gray-700 p-3 rounded">
                            {f.username || f.userName || f.email}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
