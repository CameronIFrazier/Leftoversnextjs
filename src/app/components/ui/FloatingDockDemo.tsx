import React from "react";
import { FloatingDock } from "./floating-dock";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      title: "Sponsor Page",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
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
