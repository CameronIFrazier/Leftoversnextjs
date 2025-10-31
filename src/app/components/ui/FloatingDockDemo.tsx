import React from "react";
import { FloatingDock } from "./floating-dock";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
//force deploy comment again
import {
  IconBrandGithub,
  IconBrandX,
  IconEdit,
  IconExchange,
  IconHome,
  IconInbox,
  IconNewSection,
  IconNotebook,
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
        <Image
          src="/inbox-svgrepo-com.svg"            
          alt="Inbox"
          width={32}
          height={32}
          className="h-full w-full object-contain scale-125"
          priority
        />
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
