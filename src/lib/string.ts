export function upperFirstLetter(s: string) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

export function normalizeString(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/-/gu, " ")
    .toLowerCase()
    .trim();
}
