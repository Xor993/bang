import type { Card, Suit } from '../../shared/types/game';


export interface CheckResult {
  drawnCard: Card;
  suit: Suit;
  matchesSuit: (requiredSuit: Suit) => boolean;
}

export const checkResultFromCard = (drawnCard: Card): CheckResult => ({
  drawnCard,
  suit: drawnCard.suit,
  matchesSuit: (requiredSuit: Suit) => drawnCard.suit === requiredSuit,
});

/**
 * Выполнить проверку - вытянуть карту из колоды и проверить её свойства
 * @param deck - колода карт
 * @param requiredSuit - требуемая масть для успеха (например, 'hearts' для тюрьмы)
 * @returns результат проверки с вытянутой картой и функцией проверки
 */
export const performCheck = (deck: Card[]): CheckResult | null => {
  if (deck.length === 0) return null;

  const drawnCard = deck[deck.length - 1]; // Берем последнюю карту (первую из конца)

  return {
    drawnCard,
    suit: drawnCard.suit,
    matchesSuit: (suit: Suit) => drawnCard.suit === suit,
  };
};

export const checkJailEscape = (checkResult: CheckResult): boolean => {
  return checkResult.matchesSuit('hearts');
};


export const checkDynamiteEscape = (checkResult: CheckResult): boolean => {
  const { drawnCard } = checkResult;

  if (drawnCard.suit !== 'spades') return true;

  const dynamiteValues = ['2', '3', '4', '5', '6', '7', '8', '9'];
  return !dynamiteValues.includes(drawnCard.value);
};


export const checkBarrelStop = (checkResult: CheckResult): boolean => {
  return checkResult.matchesSuit('hearts');
};
