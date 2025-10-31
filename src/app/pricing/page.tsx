"use client";
import React from "react";
import { NavbarDemo } from "../components/ui/NavbarDemo";

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

const PRICING_TIERS: PricingTier[] = [
  {
    name: "Basic",
    price: "$9.99",
    description: "Perfect for getting started",
    features: [
      "Basic profile customization",
      "Standard support",
      "Access to community features",
      "Up to 5 posts per day",
    ],
  },
  {
    name: "Pro",
    price: "$19.99",
    description: "Most popular for enthusiasts",
    features: [
      "Advanced profile customization",
      "Priority support",
      "Access to premium features",
      "Unlimited posts",
      "Custom profile themes",
      "Analytics dashboard",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Contact Us",
    description: "For serious content creators",
    features: [
      "All Pro features",
      "Dedicated account manager",
      "Custom branding options",
      "API access",
      "Advanced analytics",
      "SLA support",
      "Team collaboration tools",
    ],
  },
];

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div
      className={`rounded-4xl p-6 ${
        tier.highlighted
          ? "border-5 border-indigo-400 bg-indigo-950/30"
          : "border border-white/20 bg-black/40"
      }`}
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
        <div className="text-3xl font-bold text-indigo-400 mb-6">{tier.price}</div>
      </div>

      <ul className="space-y-3">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-gray-300">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <button
        className={`w-full mt-8 py-3 px-6 rounded-lg font-medium transition-all
          ${
            tier.highlighted
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-white/10 text-white hover:bg-white/20"
          }
        `}
      >
        {tier.price === "Contact Us" ? "Contact Sales" : "Get Started"}
      </button>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarDemo />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-400">
            Choose the plan that&apos;s right for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Questions about our pricing?
          </h2>
          <p className="text-gray-400 mb-8">
            Contact our team for more information about our pricing and custom
            plans.
          </p>
          <button className="bg-white/10 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-all">
            <a href="/contact">Contact Support</a>
          </button>
        </div>
      </div>
    </div>
  );
}