import { cn } from "@repo/ui";
import React from "react";

const LoadingSpinner = ({className, ...props}: {
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center justify-center h-full", className)} {...props}>
      <div className="w-4 h-4 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
