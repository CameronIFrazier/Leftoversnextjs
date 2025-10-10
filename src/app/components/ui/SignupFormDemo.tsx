"use client";
import React, {useState} from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/app/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { pass } from "three/tsl";
import { ShineBorder } from "./shineborder";




export function SignupFormDemo() {

   const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  }); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const res = await fetch("/api/test-db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    console.log(formData);
  };
  


  return (
    <> 
    <div className="shadow-input max-w-md rounded-none border bg-black p-4 md:rounded-2xl md:p-8 dark:bg-black pb-4 ">
      <h2 className="text-xl font-bold text-indigo-300 dark:text-neutral-200">
        Welcome to Leftovers
      </h2>
      <p className="mt-2 max-w-sm text-sm text-white dark:text-neutral-300">
        Login to Leftovers Here 
      </p>

      <form className="my-4" onSubmit={handleSubmit}>
        <div className=" flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
           
            <Input id="firstname" placeholder="Tyler" type="text"  
              onChange={handleChange}/>
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Durden" type="text"  
              onChange={handleChange}/>
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mt-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" type="email"             
            onChange={handleChange}
 />
        </LabelInputContainer>
        <LabelInputContainer className="mt-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" 
            onChange={handleChange}/>
        </LabelInputContainer>
        

        <button
          className="mt-4 group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        
      </form>
    </div>
    </>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
