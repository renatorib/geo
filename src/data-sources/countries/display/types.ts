export type DisplayProps<T> = {
  data: T;
  checked: "correct" | "spoiler" | false;
};

export type Display<T> = (props: DisplayProps<T>) => JSX.Element;
