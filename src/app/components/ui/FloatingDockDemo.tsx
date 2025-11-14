import React from "react";
import { FloatingDock } from "./floating-dock";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
//force deploy comment again
import {
  IconEdit,
  IconHome,
  IconInbox,
  IconNewSection,
  IconNotebook,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";

export function FloatingDockDemo() {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://leftoversnextjs-qebo.vercel.app/",
    },
    {
      title: "Create new Post",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/profilePage",
    },
    {
      title: "Sponsors",
      icon: (
        <Image
          src="/s.svg"           
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
      title: "Inbox",
      icon: (
        <IconInbox className="h-full w-full text-neutral-500 dark:text-neutral-300" />

      ),
      href: "/InboxPage",
      
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
        <IconNotebook className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/feedPage",
    },
    {
      title: "Search",
      icon: (
        <IconSearch className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/search",
    },
    

    
  ];
  return (
    <div className="flex items-center justify-center">
      <FloatingDock
        mobileClassName="translate-y-20" 
        items={links}
      />
    </div>
  );
}
