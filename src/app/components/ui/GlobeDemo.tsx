import { Globe } from "@/app/components/ui/globemagicui"
{/**Current the magic ui globe */}
export function GlobeDemo() {
  return (
    <div className=" relative flex size-full max-w-lg items-center justify-center overflow-hidden rounded-lg  px-40 pt-8 pb-40 md:pb-60">
       
      <Globe className="top-28" />
      <div className="pointer-events-none absolute inset-0 h-full " />
    </div>
  )
}
