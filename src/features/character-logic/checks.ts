import type { Card, Player } from '../../shared/types/game';
import { drawFromState } from '../game-logic/draw';
import { hasCharacter } from './ids';

type DrawCheckResult = {
  deck: Card[];
  discard: Card[];
  chosenCard: Card | null;
  checkCards: Card[] | null;
};

export const drawCheckCardsForPlayer = (
  player: Player | undefined,
  deck: Card[],
  discard: Card[],
): DrawCheckResult => {
  const cardsToReveal = hasCharacter(player, 'lucky_duke') ? 2 : 1;
  let nextDeck = deck;
  let nextDiscard = discard;
  const revealedCards: Card[] = [];

  for (let i = 0; i < cardsToReveal; i += 1) {
    const drawResult = drawFromState(nextDeck, nextDiscard);
    nextDeck = drawResult.nextDeck;
    nextDiscard = drawResult.nextDiscard;
    if (drawResult.drawnCard) {
      revealedCards.push(drawResult.drawnCard);
    }
  }

  if (revealedCards.length === 0) {
    return { deck: nextDeck, discard: nextDiscard, chosenCard: null, checkCards: null };
  }

  nextDiscard = [...revealedCards, ...nextDiscard];

  return {
    deck: nextDeck,
    discard: nextDiscard,
    chosenCard: revealedCards.length === 1 ? revealedCards[0] : null,
    checkCards: revealedCards.length > 1 ? revealedCards : null,
  };
};
