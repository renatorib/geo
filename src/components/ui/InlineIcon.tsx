import React from "react";

import { fr } from "~/lib/react";
import { cn } from "~/lib/styles";

export const InlineIcon = fr((props, ref) => {
  return (
    <div ref={ref} {...props} className={cn("inline-flex text-xl rounded", props.className)}>
      {props.children}
    </div>
  );
});
