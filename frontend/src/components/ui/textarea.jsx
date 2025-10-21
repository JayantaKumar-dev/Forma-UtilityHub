import * as React from "react";

export const Textarea = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white/30 px-3 py-2 text-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
