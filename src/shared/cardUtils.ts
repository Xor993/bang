import type { Card, Suit } from './types/game';

const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

export const getSuitSymbol = (suit: Suit) => SUIT_SYMBOLS[suit];

export const isRedSuit = (suit: Suit) => suit === 'hearts' || suit === 'diamonds';

export const isRedCard = (card: Pick<Card, 'suit'>) => isRedSuit(card.suit);
