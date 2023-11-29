import React from "react";

import { openModal } from "@mantine/modals";
import Confetti from "react-confetti";
import ReactDOM from "react-dom";
import { GiPartyPopper } from "react-icons/gi";

import { Text } from "~/components/ui/Text";

type Props = {
  guesses: number;
  name?: string;
  time: string;
};

export const CongratulationsModal = (props: Props) => {
  return (
    <div className="flex flex-col items-center gap-4 overflow-hidden">
      {ReactDOM.createPortal(<Confetti />, document.body)}
      <Text color="violet" style={{ animation: "pop 500ms ease-in" }}>
        <GiPartyPopper size={120} />
      </Text>
      <Text color="gray" className="text-center">
        <>
          <strong>Congratulations!</strong>
          <br />
          You have completed {props.guesses} guesses {props.name && <>of {props.name}</>} in{" "}
          <strong>{props.time}</strong>
        </>
      </Text>
    </div>
  );
};

export const openCongratulationsModal = (props: Props) => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  openModal({
    size: "xs",
    overlayProps: {
      color: "rgba(255, 255, 255, 0)",
    },
    centered: true,
    withCloseButton: false,
    children: <CongratulationsModal {...props} />,
  });
};
