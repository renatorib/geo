import React from "react";

import { fr } from "~/lib/react";
import { cn } from "~/lib/styles";

type FloatingGuessBarProps = {
  hidden?: boolean;
  full?: boolean;
};

export const FloatingGuessBar = fr<FloatingGuessBarProps>(({ hidden, full = false, ...props }, ref) => {
  return (
    <div
      className={cn(
        "absolute right-0 left-0 md:inset-x-center md:left-auto md:right-auto z-10 light",
        full && "w-full",
      )}
    >
      <div
        ref={ref}
        {...props}
        className={cn(
          !full && "md:w-[600px] md:m-2 md:max-w-[calc(100%-50px)]",
          "flex items-center justify-between gap-3",
          "transition-opacity opacity-0",
          !hidden && "opacity-100",
        )}
      />
    </div>
  );
});
