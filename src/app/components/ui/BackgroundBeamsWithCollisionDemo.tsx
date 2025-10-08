import React from "react";
import { BackgroundBeamsWithCollision } from "@/app/components/ui/background-beams-with-collision";
import { SignupFormDemo } from "./SignupFormDemo";
import { NavbarDemo } from "./NavbarDemo";
import { RetroGridDemo } from "./RetroGridDemo";
import { GlobeDemo } from "./GlobeDemo";

export function BackgroundBeamsWithCollisionDemo() {
  return (
    <BackgroundBeamsWithCollision className="flex flex-col h-[200vh] w-screen items-center justify-start ">
      <div className="flex-col relative items-start justify-start w-[70%] ">
        <NavbarDemo></NavbarDemo>

       
        <div className="flex flex-row pt-10">
          <SignupFormDemo></SignupFormDemo>

          {/**BOTTOM RIGHT CONTAINER */}
          <div className="w-full h-full flex flex-col items-start justify-start pl-4  ">
            <div className="relative w-[51vw] h-[25vw] overflow-hidden rounded-lg gap-4 ">
              <iframe
                className=" absolute top-1/2 left-1/2 w-[177.77vh] h-[100vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                src="https://www.youtube.com/embed/vlRt36fKgaw?autoplay=1&mute=1&loop=1&playlist=vlRt36fKgaw"
                title="YouTube video"
                frameBorder="0"
                allow="autoplay; fullscreen"
              ></iframe>
            </div>
            <div className="w-full">
              <h1 className="text-5xl font-bold pt-4">
                We help you find your sponsors, easy.
              </h1>
              <h1 className="text-5xl font-bold pt-4 flex items-center justify-center">
                {" "}
                Its that simple
              </h1>
            </div>
          </div>
        </div>
      </div>
      {/**Bottom half container */}
      <div className="flex flex-col pt-10 w-full items-center justify-center">
        <h1 className="text-5xl pb-10">Join millions of aspiring e-sports professionals worldwide</h1>
        <div className="w-full flex flex-row">
          {" "}
          <div className="w-[50%] h-[80vh] flex items-center justify-center">
            <GlobeDemo></GlobeDemo>
          </div >
          <div className="w-[50%] h-[70vh] flex items-center justify-start ">
            <SignupFormDemo></SignupFormDemo>
          </div>
          
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
