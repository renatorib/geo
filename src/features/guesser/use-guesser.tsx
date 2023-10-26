import React from "react";

import { notifications } from "@mantine/notifications";
import { RiCheckDoubleFill } from "react-icons/ri";

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
  refocus?: boolean;
  onComplete?: () => void;
  onGuess?: (props: { correct: boolean; text: string; node: Node<T> }) => void;
  onCorrectGuess?: (node: Node<T>) => void;
};

export const useGuesser = <T extends Entity>(props: UseGuesserProps<T>) => {
  const {
    data: initialData,
    initialShuffled = true,
    openCongratulations = true,
    refocus = true,
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
      const newSavedData = (data: Node<T>[]) => {
        return data.map((_node) => {
          if (node.id !== _node.id) return _node;
          return { ...node, checked: true };
        });
      };

      const isCompleted = !newSavedData(data).some((node) => node.checked === false);
      setData(newSavedData);
      playSound("correct", { volume: 0.1 });
      notifyCorrectAnswer(answer(node).value);
      selectNextNode();
      onCorrectGuess?.(node);

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
    }

    onGuess?.({ node, text, correct });

    return correct;
  };

  const guessAll = (text: string) => {
    for (const node of data) {
      if (!node.checked) {
        const correct = guess(node, text);
        if (correct) return true;
      }
    }

    return false;
  };

  const getNodeStatus = (node: Node<T>) => {
    return node.checked ? "correct" : spoiler ? "spoiler" : "hidden";
  };

  const getNextUnchecked = (node: Node<T>) => {
    const index = data.findIndex((n) => node.id === n.id);
    const lookup = [...data.slice(index + 1, data.length), ...data.slice(0, index + 1)];
    return lookup.find((nd) => nd.checked === false);
  };

  const selectNextNode = () => {
    const current = selectedNode;
    const next = getNextUnchecked(selectedNode);
    if (next) {
      if (refocus) {
        const currInput = document.querySelector<HTMLInputElement>(`[data-quiz-input-id="${current.id}"]`);
        currInput?.blur();
        onNextPaint(() => {
          const nextInput = document.querySelector<HTMLInputElement>(`[data-quiz-input-id="${next.id}"]`);
          nextInput?.focus();
        });
      }
      setSelectedNode(next);
    }
  };

  const isCompleted = !data.some((node) => node.checked === false);
  const totalChecked = data.filter((node) => node.checked === true).length;

  return {
    data,
    shuffle,
    reset,
    spoiler,
    toggleSpoiler,
    answer,
    guess,
    guessAll,
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

function notifyCorrectAnswer(text: string) {
  return notifications.show({
    icon: <RiCheckDoubleFill size={25} />,
    message: <div className="font-bold text-lg">{text}</div>,
    color: "green",
    autoClose: 1500,
    withCloseButton: false,
    classNames: {
      root: "bg-green-500",
      description: "text-white",
      icon: "bg-transparent",
    },
  });
}
