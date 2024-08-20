import Link from "next/link";
import React from "react";

import Confetti from "react-confetti";
import ReactDOM from "react-dom";
import { GiPartyPopper } from "react-icons/gi";
import { RiAddLine, RiRestartLine } from "react-icons/ri";

import { readableTime } from "~/features/timer";

import { Button } from "./ui/Button";

export const Congratulations = (props: {
  length: number;
  title: string;
  totalTime: number;
  children?: React.ReactNode;
  onRestart?: () => any;
}) => {
  const [confettis, setConfettis] = React.useState(150);

  React.useEffect(() => {
    setTimeout(() => setConfettis(10), 4000);
  }, []);

  return (
    <div className="max-w-lg px-2 md:px-0 w-full grid place-items-center mx-auto dark">
      <div className="flex flex-col items-center gap-4">
        {ReactDOM.createPortal(<Confetti numberOfPieces={confettis} />, document.body)}
        <div className="text-lime-400" style={{ animation: "pop 1000ms ease-in-out" }}>
          <GiPartyPopper size={250} />
        </div>
        <div color="gray" className="text-center text-stone-400">
          <div className="text-white text-4xl font-bold mb-2">Well done!</div>
          You have completed <strong className="text-stone-200">{props.length}</strong> guesses of{" "}
          <span>{'"' + props.title + '"'}</span> in{" "}
          <strong className="text-stone-200">{readableTime(props.totalTime)}</strong>
        </div>
        <div className="my-4">
          <div className="flex flex-col items-center gap-2">
            {props.onRestart && (
              <Button color="lime" size="xl" padding="xl" variant="outline" onClick={props.onRestart}>
                <RiRestartLine /> Restart
              </Button>
            )}
            <Link href="/">
              <Button color="lime" variant="link">
                <RiAddLine /> Play new game
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
