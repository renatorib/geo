import React from "react";

import { notifications } from "@mantine/notifications";
import { RiCheckDoubleFill } from "react-icons/ri";

import { useSettings } from "~/features/settings";
import { playSound } from "~/features/sounds";
import { useTimer } from "~/features/timer";
import { Answer, Entity } from "~/games";
import { shuffle as shuffleArray } from "~/lib/array";
import { onNextPaint } from "~/lib/dom";
import { normalizeString } from "~/lib/string";

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
  onCorrectGuess?: (node: Node<T>, next: Node<T> | undefined) => void;
  onSelectNode?: (node: Node<T>) => void;
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
    onSelectNode,
  } = props;

  const { lang } = useSettings();
  const timer = useTimer();

  const [data, setData] = React.useState<Node<T>[]>(() => {
    const initialNodes = initialData.map((entity) => ({ entity, id: entity.id, checked: false }));
    return initialShuffled ? shuffleArray(initialNodes) : initialNodes;
  });
  const [spoiler, setSpoiler] = React.useState(false);
  const [selectedNode, _setSelectedNode] = React.useState<Node<T>>(data[0]);
  const setSelectedNode = (node: Node<T>) => {
    _setSelectedNode(node);
    onSelectNode?.(node);
  };

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

  /** @deprecated use getAnswer instead */
  const answer = (node: Node<T>) => props.answer(node.entity, lang.property);

  const getAnswer = (node: Node<T>) => props.answer(node.entity, lang.property);

  const getAllAnswers = (node: Node<T>) => {
    const { value, aliases } = getAnswer(node);
    return [value, ...aliases].map(normalizeString);
  };

  const guess = (node: Node<T>, text: string) => {
    if (!timer.started) timer.start();

    const answers = getAllAnswers(node);
    const correct = answers.includes(normalizeString(text));

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
      const next = selectNextNode(node);
      onCorrectGuess?.(node, next);

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

  const getNodeValue = (node: Node<T>) => {
    return getAnswer(node).value;
  };

  const getNodeAliases = (node: Node<T>) => {
    return getAnswer(node).aliases;
  };

  const getNextUnchecked = (node: Node<T>) => {
    const index = data.findIndex((n) => node.id === n.id);
    const lookup = [...data.slice(index + 1, data.length), ...data.slice(0, index + 1)];
    return lookup.find((nd) => nd.checked === false);
  };

  const selectNextNode = (current: Node<T> = selectedNode) => {
    const next = getNextUnchecked(current);
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
      return next;
    }
  };

  const getNode = <E extends { id: T["id"] }>(entity: E) => {
    const node = data.find((node) => node.id === entity.id);
    return node;
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
    getAnswer,
    getAllAnswers,
    guess,
    guessAll,
    timer,

    isCompleted,
    totalChecked,

    getNode,
    getNodeStatus,
    getNodeValue,
    getNodeAliases,
    getNextUnchecked,

    selectedNode,
    setSelectedNode,
    selectNextNode,
  };
};

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
