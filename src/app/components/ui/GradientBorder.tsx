import React from "react";

// Reusable gradient border component
interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "a";
  href?: string;
  target?: string;
  rel?: string;
}

const GradientBorder: React.FC<GradientBorderProps> = ({ 
  children, 
  className = "", 
  as = "div",
  ...props 
}) => {
  const baseClasses = `block p-[3px] rounded-lg bg-gradient-to-b from-purple-500 to-indigo-500 transition-all duration-200 ${className}`;
  
  if (as === "a") {
    return (
      <a className={baseClasses} {...props}>
        {children}
      </a>
    );
  }
  
  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};

export default GradientBorder;