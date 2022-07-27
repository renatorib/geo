type QuizCardProps = {
  answer: string;
  status: "open" | "correct" | "spoiler";
  onGuess: (guess: string) => void;
  width?: number;
};

export const QuizCard = (props: QuizCardProps) => {};
