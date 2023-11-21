import React from "react";

import { fr } from "~/lib/react";
import { cn } from "~/lib/styles";

type FloatingGuessBarProps = {
  hidden?: boolean;
};

export const FloatingGuessBar = fr<FloatingGuessBarProps>(({ hidden, ...props }, ref) => {
  return (
    <div className="absolute sm:inset-x-center right-0 left-0 sm:left-auto sm:right-auto z-10">
      <div
        ref={ref}
        {...props}
        className={cn(
          "sm:w-[600px] w-full",
          "p-3 sm:m-2 flex items-center justify-between gap-3 sm:border border-solid border-slate-400/20 bg-white/70",
          "backdrop-blur-sm sm:rounded-lg shadow-sm sm:shadow-none transition-opacity opacity-0",
          !hidden && "opacity-100",
        )}
      />
    </div>
  );
});
