import React from "react";

import { RiMicFill } from "react-icons/ri";

import { ButtonIcon } from "~/components/ui/ButtonIcon";
import { Tooltip } from "~/components/ui/Tooltip";
import { useWindowEvent } from "~/hooks";
import { fr } from "~/lib/react";
import { cn } from "~/lib/styles";

export const Recorder = fr<{ recording?: boolean; onRecord: () => any }, typeof ButtonIcon>((props, ref) => {
  useWindowEvent("keydown", (e) => {
    if (e.ctrlKey && e.code === "Space") {
      props.onRecord();
    }
  });

  return (
    <Tooltip content="Speech (Ctrl+Space)">
      <ButtonIcon
        ref={ref}
        type="button"
        radius="full"
        size="md"
        color={props.recording ? "red" : "slate"}
        {...props}
        onClick={() => props.onRecord()}
        variant={props.recording ? "filled" : props.variant ?? "ghost"}
        className={cn("select-none transition-all", props.recording ? "animate-pulse" : "")}
      >
        <RiMicFill />
      </ButtonIcon>
    </Tooltip>
  );
});
