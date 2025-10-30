import React from "react";
import { FloatingDock } from "./floating-dock";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
  IconUser,
} from "@tabler/icons-react";

export function FloatingDockDemo() {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://leftoversnextjs-pyhl.vercel.app/",
    },
    {
      title: "Creat new Post",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/profilePage",
    },
    {
      title: "Sponsors",
      icon: (
        <Image
          src="/s.svg"            // file at /public/s.svg
          alt="Sponsors"
          width={32}
          height={32}
          className="h-full w-full object-contain"
          priority
        />
      ),
      href: "/SponsorPage",
      
    },
        {
      title: "Profile",
      icon: (
        <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/profilePage",
      
    },
    {
      title: "Feed",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/feedPage",
    }

    

    
    
  ];
  return (
    <div className="flex items-center justify-center w-[50%]">
      <FloatingDock
        mobileClassName="translate-y-20" // only for demo, remove for production
        items={links}
      />
    </div>
  );
}