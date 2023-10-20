import React from "react";

import { useSettings } from "~/features/settings";
import { playSound } from "~/features/sounds";
import { useTimer } from "~/features/timer";
import { Answer, Entity } from "~/games";
import { shuffle as shuffleArray } from "~/lib/array";
import { onNextPaint } from "~/lib/dom";

import { openCongratulationsModal } from "./CongratulationsModal";

export type Node<T extends Entity> = {
  entity: T;
  id: T["id"];
  checked: boolean;
};

type UseGuesserProps<T extends Entity> = {
  data: T[];
  answer: Answer<T>;
  title?: string;
  initialShuffled?: boolean;
  openCongratulations?: boolean;
  onComplete?: () => void;
  onGuess?: (props: { correct: boolean; text: string; node: Node<T> }) => void;
  onCorrectGuess?: (node: Node<T>) => void;
};

export const useGuesser = <T extends Entity>(props: UseGuesserProps<T>) => {
  const {
    data: initialData,
    initialShuffled = true,
    openCongratulations = true,
    onComplete,
    onGuess,
    onCorrectGuess,
  } = props;

  const { lang } = useSettings();
  const timer = useTimer();

  const [data, setData] = React.useState<Node<T>[]>(() => {
    const initialNodes = initialData.map((entity) => ({ entity, id: entity.id, checked: false }));
    return initialShuffled ? shuffleArray(initialNodes) : initialNodes;
  });
  const [spoiler, setSpoiler] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState<Node<T>>(data[0]);

  const shuffle = () => {
    setData((data) => {
      const newData = shuffleArray(data);
      const firstUnchecked = newData.find((node) => node.checked === false);
      setSelectedNode(firstUnchecked ?? newData[0]);
      return newData;
    });
  };

  const reset = () => {
    setSpoiler(false);
    setData((data) => data.map((node) => ({ ...node, checked: false })));
    shuffle();
    timer.reset();
  };

  const toggleSpoiler = () => setSpoiler((s) => !s);

  const answer = (node: Node<T>) => props.answer(node.entity, lang.property);

  const guess = (node: Node<T>, text: string) => {
    if (!timer.started) timer.start();

    const { value, aliases } = answer(node);
    const answers = [value, ...aliases].map(normalizeGuess);
    const correct = answers.includes(normalizeGuess(text));

    if (correct) {
      setData((data) =>
        data.map((_node) => {
          if (node.id !== _node.id) return _node;
          return { ...node, checked: true };
        }),
      );
      playSound("correct", 0.1);
      selectNextNode();
      onCorrectGuess?.(node);
    }

    onGuess?.({ node, text, correct });

    return correct;
  };

  const getNodeStatus = (node: Node<T>) => {
    return node.checked ? "correct" : spoiler ? "spoiler" : "idle";
  };

  const getNextUnchecked = (node: Node<T>) => {
    const index = data.findIndex((n) => node.id === n.id);
    const lookup = [...data.slice(index + 1, data.length), ...data.slice(0, index + 1)];
    return lookup.find((nd) => nd.checked === false);
  };

  const selectNextNode = ({ focus = true }: { focus?: boolean } = {}) => {
    const current = selectedNode;
    const next = getNextUnchecked(selectedNode);
    if (next) {
      if (focus) {
        const currInput = document.querySelector<HTMLInputElement>(`[data-quiz-card-id="${current.id}"] input`);
        currInput?.blur();
        onNextPaint(() => {
          const nextInput = document.querySelector<HTMLInputElement>(`[data-quiz-card-id="${next.id}"] input`);
          nextInput?.focus();
        });
      }
      setSelectedNode(next);
    }
  };

  const isCompleted = !data.some((node) => node.checked === false);
  const totalChecked = data.filter((node) => node.checked === true).length;

  React.useEffect(() => {
    if (isCompleted) {
      onComplete?.();
      if (openCongratulations) {
        const totalTime = timer.end();
        openCongratulationsModal({
          guesses: data.length,
          name: props.title,
          time: totalTime,
        });
      }
    }
  }, [openCongratulations, isCompleted]); // eslint-disable-line

  return {
    data,
    shuffle,
    reset,
    spoiler,
    toggleSpoiler,
    answer,
    guess,
    timer,

    isCompleted,
    totalChecked,

    getNodeStatus,
    getNextUnchecked,

    selectedNode,
    setSelectedNode,
    selectNextNode,
  };
};

function normalizeGuess(input: string) {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/-/gu, " ")
    .toLowerCase()
    .trim();
}
