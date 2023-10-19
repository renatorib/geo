import React from "react";

import { Box, Portal, Text } from "@mantine/core";
import { openModal } from "@mantine/modals";
import Confetti from "react-confetti";
import { GiPartyPopper } from "react-icons/gi";

type Props = {
  guesses: number;
  name?: string;
  time: string;
};

export const CongratulationsModal = (props: Props) => {
  return (
    <Box style={{ display: "flex", alignItems: "center", flexDirection: "column", gap: 10 }}>
      <Portal>
        <Confetti />
      </Portal>
      <Text c="violet" style={{ animation: "pop 500ms ease-in" }}>
        <GiPartyPopper size={120} />
      </Text>
      <Text c="dark" ta="center">
        <>
          <strong>Congratulations!</strong>
          <br />
          You have completed {props.guesses} guesses {props.name && <>of {props.name}</>} in{" "}
          <strong>{props.time}</strong>
        </>
      </Text>
    </Box>
  );
};

export const openCongratulationsModal = (props: Props) => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  openModal({
    size: "xs",
    overlayProps: {
      color: "rgba(200, 200, 200, 0.7)",
      blur: 2,
    },
    centered: true,
    withCloseButton: false,
    children: <CongratulationsModal {...props} />,
  });
};
