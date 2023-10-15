import React from "react";

import { ActionIcon } from "@mantine/core";
import { RiMicFill } from "react-icons/ri";

import { fr } from "~/lib/react";

export const Recorder = fr<typeof ActionIcon<"button">, { recording?: boolean }>((props, ref) => {
  return (
    <ActionIcon
      ref={ref}
      radius="xl"
      size="lg"
      color="red"
      {...props}
      sx={{ userSelect: "none", ...props.sx }}
      variant={props.recording ? "filled" : "default"}
      className={props.recording ? "animate-pulse" : ""}
      style={{
        transition: "all 150ms ease-out",
        ...(props.recording && { transform: "scale(1.15)" }),
      }}
    >
      <RiMicFill />
    </ActionIcon>
  );
});
