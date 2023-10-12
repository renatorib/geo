export type DisplayProps<T> = {
  data: T;
  status: "correct" | "spoiler" | "idle";
};

export type Display<T> = (props: DisplayProps<T>) => JSX.Element;
