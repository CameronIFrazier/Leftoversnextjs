"use client";
import React from "react";
import { FloatingDockDemo } from "../components/ui/FloatingDockDemo";

type Feature = {
    name: string;
    description: string;
};

const FEATURES: Feature[] = [
    {
        name: "Showcase Your Gameplay",
        description: "Upload and share your gameplay highlights to attract potential sponsors and grow your audience.",
    },
    {
        name: "Connect with Sponsors",
        description: "Browse and interact with esports sponsors looking for talented players like you.",
    },
    {
        name: "Apply for Sponsorships",
        description: "Easily apply to sponsorship opportunities directly through your profile and track your applications.",
    },
    {
        name: "Direct Messaging",
        description: "Communicate with sponsors, teammates, and other gamers securely within the platform.",
    },
    {
        name: "Profile Customization",
        description: "Show off your achievements, stats, and streaming links to make your profile stand out.",
    },
    {
        name: "Sponsor Listings",
        description: "Explore detailed sponsor profiles, their requirements, and offerings to find the perfect fit.",
    },
    {
        name: "Notifications & Updates",
        description: "Stay updated with new sponsorship opportunities, messages, and platform announcements in real-time.",
    },
];


function FeatureCard({ feature }: { feature: Feature }) {
    return (
        <div className="border border-white rounded-lg p-4 bg-black hover:bg-indigo-950 transition mb-4">
            <h2 className="text-lg font-semibold text-indigo-400">
                {feature.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-100">
                {feature.description}
            </p>
        </div>
    );
}

export default function FeaturesPage() {
    return (
        <section className="min-h-screen bg-black text-white py-16 px-6 flex flex-col items-center">
            <FloatingDockDemo></FloatingDockDemo>
            <div className="max-w-3xl mx-auto text-center mb-12">
                
                <h1 className="text-4xl font-bold text-indigo-400">Features</h1>
                <p className="mt-3 text-gray-300">
                    Explore what makes our platform powerful and easy to use.
                </p>
            </div>

            <div className="max-w-3xl mx-auto flex flex-col">
                {FEATURES.map((feature, index) => (
                    <FeatureCard key={index} feature={feature} />
                ))}
            </div>
        </section>
    );
}