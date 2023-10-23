export type DisplayProps<T> = {
  data: T;
  status: "correct" | "spoiler" | "hidden";
};

export type Display<T> = (props: DisplayProps<T>) => JSX.Element;
