"use client";
import { useEffect, useState } from "react";
import { NavbarDemo } from "./components/ui/NavbarDemo";
import { ShineBorderDemo } from "./components/ui/ShineBorderDemo";
import { GlobeDemo } from "./components/ui/GlobeDemo";
import { SignupFormDemo } from "./components/ui/SignupFormDemo";
import { PeopleYouMayKnow } from "./components/ui/PeopleYouMayKnow";

export default function Home() {
  // Ensure client-side rendering for iframe
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  return (
    <div className="flex flex-col bg-black min-h-screen w-screen items-center justify-start overflow-x-hidden ">
      <NavbarDemo />

      {/* Top Section */}
      <div className="flex flex-row pt-20 gap-8 w-[70%] ">
        {/* Left Column */}
        <div className="flex-none p-4">
          <h1 className="text-5xl font-bold text-indigo-400 pb-5">
            Go <br />
            <span className="bg-gradient-to-b from-purple-500 to-indigo-600 bg-clip-text text-transparent">
              PRO
            </span>
            <br /> With Us
          </h1>
          <ShineBorderDemo />
        </div>

        {/* Right Column: Video */}
        <div className="flex-1 flex justify-center items-center ">
          {isClient && (
            <div className="w-full max-w-4xl aspect-video rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full pointer-events-none"
                src="https://www.youtube.com/embed/vlRt36fKgaw?autoplay=1&mute=1&loop=1&playlist=vlRt36fKgaw"
                title="YouTube video"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>

      <hr className="border-t-2 border-white my-8 w-[70%]" />

      {/* Bottom Section */}
      <div
        id="signup"
        className="flex flex-col min-h-screen w-[70%] items-center justify-center gap-8"
      >
        <h1 className="text-5xl text-indigo-400 font-bold text-center">
          Join millions of aspiring e-sports professionals worldwide
        </h1>

        <div className="flex flex-row w-full gap-8">
          {/* Globe / left */}
          <div className="flex flex-1 justify-center items-center">
            <GlobeDemo />
          </div>

          {/* Signup / right */}
          <div className="flex flex-none flex-col items-center justify-start gap-6 min-h-[70vh]">
            <SignupFormDemo />
            <div className="w-full max-w-md">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
