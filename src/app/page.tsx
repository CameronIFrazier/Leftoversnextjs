import { BackgroundBeamsWithCollisionDemo } from "./components/ui/BackgroundBeamsWithCollisionDemo";
import { RetroGridDemo } from "./components/ui/RetroGridDemo";
import { SignupFormDemo } from "./components/ui/SignupFormDemo";
import { NavbarDemo } from "./components/ui/NavbarDemo";
import { GlobeDemo } from "./components/ui/GlobeDemo";
import { ShineBorderDemo } from "./components/ui/ShineBorderDemo";
import { ShineBorder } from "./components/ui/shineborder";
export default function Home() {
  return (
    <>
      {/*<BackgroundBeamsWithCollisionDemo></BackgroundBeamsWithCollisionDemo> */}
      <div className="flex flex-col bg-black min-h-screen w-screen items-center justify-start ">
        <NavbarDemo></NavbarDemo>
        <div className="flex-col relative items-start justify-start w-[70%] ">
           <div className="w-full my-4 mt-20">
  <hr className="border-t-2 border-white" />
</div>

          <div className="flex flex-row pt-15 gap-4">
  {/* Left column: takes as much space as its content needs */}
  <div className="flex-none bg-yellow p-4">
    <h1 className="text-5xl font-bold pt-4 text-indigo-400 pb-5">
      Go <br /> Pro<br /> With Us
    </h1>
    <ShineBorderDemo />
  </div>

  {/* Right column: takes remaining space */}
  <div className="flex-1 flex flex-col items-start justify-start pl-4 bg">
    <div className="relative w-full aspect-video max-w-4xl overflow-hidden rounded-lg">
      <iframe
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        src="https://www.youtube.com/embed/vlRt36fKgaw?autoplay=1&mute=1&loop=1&playlist=vlRt36fKgaw"
        title="YouTube video"
        frameBorder="0"
        allow="autoplay; fullscreen"
      ></iframe>
    </div>
  </div>
</div>

        </div>
        <div className="w-[70%] my-4 mt-20">
  <hr className="border-t-2 border-white" />
</div>

        {/**Bottom half container */}
        <div className="flex flex-col min-h-screen w-[70%] items-center justify-center">
          <h1 className="text-5xl text-indigo-400 font-bold">
            Join millions of aspiring e-sports professionals worldwide
          </h1>
          <div className="w-[90%] flex flex-row">
            {" "}
            <div className=" lex flex-1 min-h items-center justify-center bg-">
              <GlobeDemo></GlobeDemo>
            </div>
            <div className="h-[70vh] flex flex-none items-center justify-start ">
              
              <SignupFormDemo></SignupFormDemo>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
