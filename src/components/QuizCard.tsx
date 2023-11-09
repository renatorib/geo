import React from "react";

import { fr } from "~/lib/react";
import { cn, contextColors } from "~/lib/styles";

export type QuizCardProps = {
  status?: "correct" | "spoiler" | "hidden";
};

export const QuizCard = fr<QuizCardProps, "div">((_props, ref) => {
  const { status, children, ...props } = _props;

  const color: keyof typeof contextColors = status === "correct" ? "green" : status === "spoiler" ? "red" : "gray";

  return (
    <div
      ref={ref}
      {...props}
      className={cn("relative w-full focus-within:color-context-violet", contextColors[color], props.className)}
    >
      <div className="w-full">
        <div
          className={cn(
            "rounded-lg p-2 transition-all",
            "border border-solid",
            status === "hidden" && "bg-white hover:bg-context-100 border-context-300",
            status === "correct" && "bg-context-300 border-context-600",
            "focus-within:bg-context-300 focus-within:hover:bg-context-300",
            "focus-within:border-context-600 focus-within:shadow-lg",
          )}
        >
          {children && <div className="flex flex-col gap-2">{children}</div>}
        </div>
      </div>
    </div>
  );
});
