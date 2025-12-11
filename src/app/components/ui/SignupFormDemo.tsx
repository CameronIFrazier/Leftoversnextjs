"use client";
import React, {use, useState} from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
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
    userName: "",
  }); 

  const [isSuccess, setIsSuccess] = useState(false);

  const scrollToSignIn = () => {
    // Scroll to the top of the page where the sign-in section is
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }; 

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
      
      // Set success state instead of showing alert
      setIsSuccess(true);
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
    <div className={`shadow-input max-w-md rounded-none border p-4 md:rounded-2xl md:p-8 pb-4 transition-all duration-500 ${
      isSuccess 
        ? 'bg-gradient-to-br from-purple-600 to-indigo-600' 
        : 'bg-black dark:bg-black'
    }`}>
      
      {isSuccess ? (
        // Success View
        <div className="text-center py-8">
          <div className="mb-6">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              Sign up successful!
            </h2>
            <p className="text-purple-100 mb-6">
              Welcome to Leftovers! Your account has been created successfully.
            </p>
          </div>
          
          <button
            onClick={scrollToSignIn}
            className="group/btn relative block h-12 w-full rounded-md bg-white text-purple-600 font-medium 
                       shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <span className="relative z-10">Sign In Now</span>
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-white to-purple-50 opacity-0 
                           group-hover/btn:opacity-100 transition-opacity duration-200"></div>
          </button>
        </div>
      ) : (
        // Original Form View
        <>
          <h2 className="text-xl font-bold text-indigo-300 dark:text-neutral-200">
            Join us today! Create your account to start your journey with Leftovers.  
          </h2> 

          <form className="my-4" onSubmit={handleSubmit}>
            <div className=" flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <LabelInputContainer>
                <Label htmlFor="firstname">First name</Label>
               
                <Input id="firstname" placeholder="First Name" type="text"  
                  onChange={handleChange}/>
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="lastname">Last name</Label>
                <Input id="lastname" placeholder="Last Name" type="text"  
                  onChange={handleChange}/>
              </LabelInputContainer>
            </div>
            <LabelInputContainer className="mt-4">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" placeholder="email" type="email"             
                onChange={handleChange}
     />
            </LabelInputContainer>
            <LabelInputContainer className="mt-4">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="password" type="password" 
                onChange={handleChange}/>
            </LabelInputContainer>

            <LabelInputContainer className="mt-4">
              <Label htmlFor="userName">UserName</Label>
              <Input id="userName" placeholder="userName" type="userName" 
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
        </>
      )}
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