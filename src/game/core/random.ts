/**
 * Единственный источник случайности в движке.
 * В тестах его можно подменить, чтобы партии были воспроизводимыми.
 */
let random: () => number = Math.random;

export const setRandomSource = (source: () => number) => {
  random = source;
};

export const resetRandomSource = () => {
  random = Math.random;
};

export const randomIndex = (length: number) => Math.floor(random() * length);

/** Перемешивание Фишера — Йетса. Возвращает новый массив. */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
