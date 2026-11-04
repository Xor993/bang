import type { Card, GameState } from '../types';
import { getPlayer, updatePlayer } from './players';
import { randomIndex, shuffle } from './random';

// ─── Колода и сброс ─────────────────────────────────────────────────────────

/**
 * Снимает верхнюю карту колоды.
 * «Если карты в колоде закончились, перетасуйте сброс и сделайте новую колоду» (стр. 3).
 */
export function takeTopCard(state: GameState): { state: GameState; card: Card | null } {
  let { deck, discard } = state;

  if (deck.length === 0) {
    if (discard.length === 0) return { state, card: null };
    deck = shuffle(discard);
    discard = [];
  }

  const card = deck[deck.length - 1];
  return { state: { ...state, deck: deck.slice(0, -1), discard }, card };
}

/** Снимает несколько верхних карт колоды (меньше, если карт не хватает). */
export function takeTopCards(state: GameState, count: number): { state: GameState; cards: Card[] } {
  const cards: Card[] = [];
  let next = state;

  for (let i = 0; i < count; i += 1) {
    const result = takeTopCard(next);
    next = result.state;
    if (!result.card) break;
    cards.push(result.card);
  }

  return { state: next, cards };
}

export const putOnTopOfDeck = (state: GameState, card: Card): GameState => ({ ...state, deck: [...state.deck, card] });

export const discardCards = (state: GameState, cards: Card[]): GameState =>
  cards.length === 0 ? state : { ...state, discard: [...state.discard, ...cards] };

export const getTopOfDiscard = (state: GameState): Card | undefined => state.discard[state.discard.length - 1];

export function takeTopOfDiscard(state: GameState): { state: GameState; card: Card | null } {
  const card = getTopOfDiscard(state);
  if (!card) return { state, card: null };
  return { state: { ...state, discard: state.discard.slice(0, -1) }, card };
}

// ─── Рука ───────────────────────────────────────────────────────────────────

export const addToHand = (state: GameState, playerId: string, cards: Card[]): GameState =>
  updatePlayer(state, playerId, (player) => ({ ...player, hand: [...player.hand, ...cards] }));

/** Игрок берёт на руку карты из колоды. */
export function drawCards(state: GameState, playerId: string, count: number): { state: GameState; cards: Card[] } {
  const taken = takeTopCards(state, count);
  return { state: addToHand(taken.state, playerId, taken.cards), cards: taken.cards };
}

export function removeFromHand(state: GameState, playerId: string, cardId: string): { state: GameState; card: Card } {
  const card = getPlayer(state, playerId).hand.find((candidate) => candidate.id === cardId);
  if (!card) throw new Error(`Карты ${cardId} нет на руке у игрока ${playerId}`);

  return {
    state: updatePlayer(state, playerId, (player) => ({
      ...player,
      hand: player.hand.filter((candidate) => candidate.id !== cardId),
    })),
    card,
  };
}

/** Случайная карта с руки — так работают «Паника!», «Красотка», Джанго и Джесси Джеймс («вслепую»). */
export function removeRandomFromHand(state: GameState, playerId: string): { state: GameState; card: Card | null } {
  const { hand } = getPlayer(state, playerId);
  if (hand.length === 0) return { state, card: null };
  return removeFromHand(state, playerId, hand[randomIndex(hand.length)].id);
}

/** Игрок сбрасывает карту с руки. */
export const discardFromHand = (state: GameState, playerId: string, cardId: string): GameState => {
  const removed = removeFromHand(state, playerId, cardId);
  return discardCards(removed.state, [removed.card]);
};

// ─── Карты в игре ───────────────────────────────────────────────────────────

export const addToPlay = (state: GameState, playerId: string, card: Card): GameState =>
  updatePlayer(state, playerId, (player) => ({ ...player, inPlay: [...player.inPlay, card] }));

export function removeFromPlay(state: GameState, playerId: string, cardId: string): { state: GameState; card: Card } {
  const card = getPlayer(state, playerId).inPlay.find((candidate) => candidate.id === cardId);
  if (!card) throw new Error(`Карты ${cardId} нет в игре у игрока ${playerId}`);

  return {
    state: updatePlayer(state, playerId, (player) => ({
      ...player,
      inPlay: player.inPlay.filter((candidate) => candidate.id !== cardId),
    })),
    card,
  };
}

/** Забирает у игрока все карты — с руки и из игры. */
export function takeAllCards(state: GameState, playerId: string): { state: GameState; cards: Card[] } {
  const player = getPlayer(state, playerId);
  return {
    state: updatePlayer(state, playerId, (current) => ({ ...current, hand: [], inPlay: [] })),
    cards: [...player.hand, ...player.inPlay],
  };
}
