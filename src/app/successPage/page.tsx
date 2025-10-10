// app/successPage/page.tsx
"use client"
import React from "react";
import { useRouter } from "next/navigation";
export default function SuccessPage() {
    const router = useRouter();
    const goHome = () => {
        router.push("/");
    }
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black text-white flex-col ">
      <h1 className="text-3xl font-bold"> Login Successful! More features coming soon.</h1>
      <button className="p-[3px] relative mt-5">
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
  <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent" onClick={goHome} >
    Back to Home Page
  </div>
</button>
    </div>
  );
}
