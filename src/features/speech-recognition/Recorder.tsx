import React from "react";

import { RiMicFill } from "react-icons/ri";

import { ButtonIcon } from "~/components/ui/ButtonIcon";
import { fr } from "~/lib/react";
import { cn } from "~/lib/styles";

export const Recorder = fr<{ recording?: boolean }, typeof ButtonIcon>((props, ref) => {
  return (
    <ButtonIcon
      ref={ref}
      type="button"
      radius="full"
      size="md"
      color={props.recording ? "red" : "slate"}
      {...props}
      variant={props.recording ? "filled" : props.variant ?? "ghost"}
      className={cn("select-none transition-all", props.recording ? "animate-pulse" : "")}
    >
      <RiMicFill />
    </ButtonIcon>
  );
});
