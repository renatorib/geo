import React from "react";

import { fr } from "~/lib/react";
import { cn } from "~/lib/styles";

export const ProgressBar = fr<{ progress: number }>(({ progress, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn("h-2 rounded overflow-hidden bg-gray-100", props.className)}>
      <div className="h-full bg-violet-600 transition-all" style={{ width: `${progress * 100}%` }} />
    </div>
  );
});
