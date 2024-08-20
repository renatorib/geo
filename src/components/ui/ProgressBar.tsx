import React from "react";

import { fr } from "~/lib/react";
import { cn } from "~/lib/styles";

export const ProgressBar = fr<{ progress: number }>(({ progress, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("h-1.5 rounded overflow-hidden bg-stone-950/40", props.className)}
      title={`${(progress * 100).toFixed(2)}% Completed`}
    >
      <div className="h-full bg-lime-400 transition-all" style={{ width: `${progress * 100}%` }} />
    </div>
  );
});
