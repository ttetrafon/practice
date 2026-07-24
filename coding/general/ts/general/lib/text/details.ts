
export function countOccurrencesInString(text: string, search: string, min: number = 0): number {
  const matches = text.match(new RegExp(search, 'g'));
  return matches ? matches.length : min;
}
