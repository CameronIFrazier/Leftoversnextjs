"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShineBorder } from "./shineborder";
import { LoadingPage } from "./LoadingPage";

export function ShineBorderDemo() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const signIn = async () => {
    const { email, password } = formData;
    setError(""); // Clear previous errors
    setIsLoading(false); // Reset loading state

    if (!email || !password) {
      setError("Email or password is missing");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Sign-in response:", data);

      if (res.ok && data.token) {
        // ✅ Store JWT token
        localStorage.setItem("token", data.token);
        
        // Simulate loading time for better UX (optional)
        setTimeout(() => {
          setIsLoading(false);
          // Redirect to profile page
          router.push("/profilePage");
        }, 1500);
        
      } else {
        setIsLoading(false);
        setError(data.error || "Sign-in failed");
      }
    } catch (err) {
      console.error("Sign-in request error:", err);
      setIsLoading(false);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <>
      {isLoading && <LoadingPage message="Signing you in..." />}
      
      <Card className="relative w-full max-w-[350px] min-h-[300px] overflow-visible bg-black">
        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
        <CardHeader>
          <CardTitle className="text-white">Login</CardTitle>
          <CardDescription className="text-white">
            Enter your credentials to access your account
          </CardDescription>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email"
                  className="bg-white text-black"
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  className="bg-white text-black"
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <button
            className="relative p-[3px] rounded-lg"
            type="button"
            onClick={signIn}
            disabled={isLoading}
          >
            {/* Outer gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg" />

            {/* Inner button */}
            <div
              className={`relative px-8 py-2 bg-black rounded-[6px] text-white text-lg font-medium
                         transition duration-150 transform group hover:scale-105 hover:bg-transparent
                         active:scale-95 active:shadow-inner ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </div>
          </button>
        </CardFooter>
      </Card>
    </>
  );
}
