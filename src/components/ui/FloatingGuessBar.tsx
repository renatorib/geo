import React from "react";

import { fr } from "~/lib/react";
import { cn } from "~/lib/styles";

type FloatingGuessBarProps = {
  hidden?: boolean;
  full?: boolean;
};

export const FloatingGuessBar = fr<FloatingGuessBarProps>(({ hidden, full = false, ...props }, ref) => {
  return (
    <div className={cn("absolute sm:inset-x-center right-0 left-0 sm:left-auto sm:right-auto z-10", full && "w-full")}>
      <div
        ref={ref}
        {...props}
        className={cn(
          !full && "sm:w-[600px] sm:m-2",
          "w-full",
          "px-3 py-1.5 flex items-center justify-between gap-3 sm:border border-solid border-slate-400/20 bg-white/70",
          "backdrop-blur-sm sm:rounded-lg shadow-sm sm:shadow-none transition-opacity opacity-0",
          !hidden && "opacity-100",
        )}
      />
    </div>
  );
});
