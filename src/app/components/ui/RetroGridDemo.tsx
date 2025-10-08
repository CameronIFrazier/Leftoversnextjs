"use client"

import { RetroGrid } from "./RetroGridProps"
import { SignupFormDemo } from "./SignupFormDemo";
import { NavbarDemo } from "./NavbarDemo";
export function RetroGridDemo() {
  return (
    <div className="flex flex-col h-[200vh] w-screen items-center justify-start ">
      <div className="flex-col relative items-start justify-start w-[70%] "> 
              <NavbarDemo></NavbarDemo>
              
            
           
            <div className="flex w-auto items-center justify-center pb-10 pt-10">
              <h1 className="text-5xl font-bold pb-4">Sign Up Today</h1>
              </div>
              <div className="flex flex-row ">
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
                <h1 className="text-5xl font-bold pt-4">We help you find your sponsors, easy.</h1>
                <h1 className="text-5xl font-bold pt-4 flex items-center justify-center"> Its that simple</h1>
              </div>
            </div>
            </div>
            </div>
      <RetroGrid />
    </div>
  )
}
