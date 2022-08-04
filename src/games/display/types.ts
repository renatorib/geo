import { Country } from "~/countries";

export type DisplayProps = {
  country: Country;
  checked: "correct" | "spoiler" | false;
};
