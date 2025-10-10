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
      <div className="flex flex-col bg-black h-[200vh] w-screen items-center justify-start ">
        <div className="flex-col relative items-start justify-start w-[70%] ">
          <NavbarDemo></NavbarDemo>

          <div className="flex flex-row pt-15">
            <div className="w-[100%] h-full">
              <h1 className="text-5xl font-bold pt-4 text-indigo-400 pb-5">
                Go <br></br> Pro<br></br> Today
              </h1>
              <ShineBorderDemo></ShineBorderDemo>
            </div>

            <div className="w-full h-full flex flex-col items-start justify-start pl-4  ">
              <div className="relative w-[51vw] h-[26vw] overflow-hidden rounded-lg gap-4 ">
                <iframe
                  className=" absolute top-1/2 left-1/2 w-[177.77vh] h-[100vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  src="https://www.youtube.com/embed/vlRt36fKgaw?autoplay=1&mute=1&loop=1&playlist=vlRt36fKgaw"
                  title="YouTube video"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                ></iframe>
              </div>
              <div className="w-full"></div>
            </div>
          </div>
        </div>
        <hr className="border-t-2 border-white my-4" />

        {/**Bottom half container */}
        <div className="flex flex-col pt-60 w-full items-center justify-center">
          <h1 className="text-5xl text-indigo-400 font-bold">
            Join millions of aspiring e-sports professionals worldwide
          </h1>
          <div className="w-full flex flex-row">
            {" "}
            <div className="w-[50%] h-[80vh] flex items-center justify-center">
              <GlobeDemo></GlobeDemo>
            </div>
            <div className="w-[50%] h-[70vh] flex items-center justify-start ">
              <SignupFormDemo></SignupFormDemo>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
