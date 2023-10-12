import React from "react";
import { Answer, Entity } from "~/games";
import { shuffle as shuffleArray } from "~/lib/array";
import { useLang } from "~/features/i18n";
import { useRerender } from "~/hooks";

export type Node<T extends Entity> = {
  entity: T;
  id: T["id"];
  checked: boolean;
};

type UseGuesserProps<T extends Entity> = {
  initial: T[];
  answer: Answer<T>;
  initialShuffled?: boolean;
  onComplete?: () => void;
  onGuess?: (props: { correct: boolean; text: string; node: Node<T> }) => void;
};

export const useGuesser = <T extends Entity>(props: UseGuesserProps<T>) => {
  const { initial, initialShuffled = true, onComplete, onGuess } = props;
  const { property } = useLang();
  const [spoiler, setSpoiler] = React.useState(false);
  const rerender = useRerender();

  const [data, setData] = React.useState<Node<T>[]>(() => {
    const initialNodes = initial.map((entity) => ({ entity, id: entity.id, checked: false }));
    return initialShuffled ? shuffleArray(initialNodes) : initialNodes;
  });

  const shuffle = () => {
    setData((c) => shuffleArray(c));
    rerender();
  };

  const reset = () => {
    setSpoiler(false);
    setData((data) => data.map((node) => ({ ...node, checked: false })));
    shuffle();
  };

  const toggleSpoiler = () => setSpoiler((s) => !s);

  const answer = (node: Node<T>) => props.answer(node.entity, property);

  const guess = (node: Node<T>, text: string) => {
    const { value, aliases } = answer(node);
    const answers = [value, ...aliases].map(normalizeGuess);
    const correct = answers.includes(normalizeGuess(text));

    if (correct) {
      console.log("correct", node.id, value);
      setData((data) =>
        data.map((_node) => {
          if (node.id !== _node.id) return _node;
          return { ...node, checked: true };
        })
      );
      rerender();
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

  const isCompleted = !data.some((node) => node.checked === false);
  const totalChecked = data.filter((node) => node.checked === true).length;

  React.useEffect(() => {
    if (isCompleted) onComplete?.();
  }, [isCompleted]); // eslint-disable-line

  return {
    data,
    shuffle,
    reset,
    spoiler,
    toggleSpoiler,
    answer,
    guess,
    isCompleted,
    totalChecked,
    getNodeStatus,
    getNextUnchecked,
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
