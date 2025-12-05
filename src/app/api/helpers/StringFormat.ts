export function NormalizeWord(text: string) {
  const normalize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();

  return normalize(text).replace(/\s+/g, "_");
}
