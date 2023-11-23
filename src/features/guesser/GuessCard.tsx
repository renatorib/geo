import React, { useId } from "react";

import { fr } from "~/lib/react";
import { cn, contextColors } from "~/lib/styles";

export type GuessCardProps = {
  status?: "correct" | "spoiler" | "hidden";
  selected?: boolean;
  id?: string;
};

export const GUESS_CARD_ID_PROP = "data-guess-card-id";

const GuessCardBase = fr<GuessCardProps, "div">((_props, ref) => {
  const { status, children, selected = false, id: passedId, ...props } = _props;
  const genId = useId();
  const color: keyof typeof contextColors = status === "correct" ? "green" : status === "spoiler" ? "red" : "gray";

  return (
    <div
      ref={ref}
      {...props}
      {...{ [GUESS_CARD_ID_PROP]: passedId ?? genId }}
      className={cn(
        "relative w-full focus-within:color-context-violet",
        contextColors[color],
        selected && contextColors.violet,
        props.className,
      )}
    >
      <div className="w-full">
        <div
          className={cn(
            "rounded-lg p-2 transition-all cursor-pointer",
            "border border-solid",
            status === "hidden" && "bg-white hover:bg-context-100 border-context-100",
            status === "correct" && "bg-context-300 border-context-600",
            "focus-within:bg-context-300 focus-within:hover:bg-context-300",
            "focus-within:border-context-600 focus-within:shadow-lg",
            selected && "bg-context-300 border-context-600 shadow-lg",
          )}
        >
          {children && <div className="flex flex-col gap-2">{children}</div>}
        </div>
      </div>
    </div>
  );
});

const getById = (id: string | number) => {
  return document.querySelector<HTMLInputElement>(`[${GUESS_CARD_ID_PROP}="${id}"]`);
};

const scrollIntoView = (id: string | number) => {
  return getById(id)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

export const GuessCard = Object.assign(GuessCardBase, {
  getById,
  scrollIntoView,
});
