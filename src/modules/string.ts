export function upperFirstLetter(s: string) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

export const normalizeGuess = (input: string) =>
  input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/-/gu, " ")
    .toLowerCase()
    .trim();
