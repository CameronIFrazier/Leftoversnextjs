"use client";
import React from "react";

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = "Loading your profile..." }: LoadingPageProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Spinning loader */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          
          {/* Pulsing glow effect */}
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-pulse mx-auto opacity-50"></div>
        </div>
        
        {/* Loading text */}
        <h2 className="text-2xl font-semibold text-white mb-2">
          {message}
        </h2>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
        
        <p className="text-gray-400 mt-4 text-sm">
          Please wait while we prepare your dashboard...
        </p>
      </div>
    </div>
  );
}