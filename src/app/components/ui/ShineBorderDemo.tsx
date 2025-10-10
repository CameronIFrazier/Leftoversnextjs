"use client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import React, {useState} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShineBorder } from "./shineborder"

export function ShineBorderDemo() {
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { id, value } = e.target;
  setFormData(prev => ({ ...prev, [id]: value }));
};
const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  }); 


  const signIn = async () => {
  const { email, password } = formData;

  if (!email || !password) {
    console.log("Email or password is missing");
    return;
  }

  try {
    const res = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Sign-in response:", data);

    if (res.ok) {
      console.log("User signed in successfully!");
      // Navigate to blank page
      router.push("../successPage"); // <- this will go to pages/blank/page.tsx
    } else {
      console.error("Sign-in failed:", data.error);
    }
  } catch (err) {
    console.error("Sign-in request error:", err);
  }
};

  return (
    <Card className="relative w-full max-w-[350px] min-h-[300px] overflow-visible bg-black">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      <CardHeader>
        <CardTitle className="text-white">Login</CardTitle>
        <CardDescription className="text-white">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input id="email" type="email" placeholder="email" className="bg-white text-black" onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white ">Password</Label>
              <Input id="password" type="password" placeholder="1234" className="bg-white text-black" onChange={handleChange} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <button className="p-[3px] relative" type="button" onClick={signIn}>
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
  <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
    Sign in
  </div>
</button>
      </CardFooter>
    </Card>
  )
}
