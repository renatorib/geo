import React from "react";
import { Box, Portal, Text } from "@mantine/core";
import Confetti from "react-confetti";
import { GiPartyPopper } from "react-icons/gi";
import { pop } from "~/styles/keyframes";
import { openModal } from "@mantine/modals";

type Props = {
  guesses: number;
  name: string;
  time: string;
};

export const CongratulationsModal = (props: Props) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", gap: 10 }}>
      <Portal>
        <Confetti />
      </Portal>
      <Text color="violet" sx={{ animation: `${pop} 500ms ease-in` }}>
        <GiPartyPopper size={120} />
      </Text>
      <Text color="dark" align="center">
        <>
          <strong>Congratulations!</strong>
          <br />
          You have completed {props.guesses} guesses of {props.name} in <strong>{props.time}</strong>
        </>
      </Text>
    </Box>
  );
};

export const openCongratulationsModal = (props: Props) => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  openModal({
    size: "xs",
    overlayColor: "rgba(200, 200, 200, 0.7)",
    overlayBlur: 2,
    centered: true,
    withCloseButton: false,
    children: <CongratulationsModal {...props} />,
  });
};
