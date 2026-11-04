/**
 * «Проверка» (стр. 8): переверните верхнюю карту колоды и сравните её масть и достоинство
 * с условием на карте. Карта проверки в любом случае уходит в сброс.
 * Счастливчик Люк открывает 2 карты и выбирает одну — обе уходят в сброс.
 */
import { discardCards, takeTopCards } from '../core/cards';
import { getPlayer } from '../core/players';
import { getCheckCardCount } from '../rules/characterRules';
import type { Card, CheckChoicePrompt, CheckReason, GameState, Rank, ShotPrompt } from '../types';

const DYNAMITE_RANKS: ReadonlySet<Rank> = new Set(['2', '3', '4', '5', '6', '7', '8', '9']);

/** «Динамит» взрывается на пике от двойки до девятки включительно. */
export const doesDynamiteExplode = (card: Card) => card.suit === 'spades' && DYNAMITE_RANKS.has(card.rank);

/**
 * Пройдена ли проверка — то есть случилось ли хорошее для проверяющего:
 * вышел из «Тюрьмы», «Бочка» отменила попадание, «Динамит» не взорвался.
 */
export function isCheckPassed(reason: CheckReason, card: Card | null): boolean {
  if (!card) return false;
  return reason === 'DYNAMITE' ? !doesDynamiteExplode(card) : card.suit === 'hearts';
}

export const CHECK_LABELS: Record<CheckReason, string> = {
  DYNAMITE: '«Динамит»',
  JAIL: '«Тюрьма»',
  BARREL: '«Бочка»',
  JOURDONNAIS: 'бочка Человека-без-Имени',
};

type RevealResult = { state: GameState; card: Card | null; awaitingChoice: boolean };

/**
 * Вскрывает карту(ы) проверки. Если игроку нужно выбрать карту (Счастливчик Люк),
 * открывает запрос CHOOSE_CHECK_CARD и возвращает awaitingChoice = true.
 */
export function revealCheck(state: GameState, playerId: string, reason: CheckReason, shot?: ShotPrompt): RevealResult {
  const count = getCheckCardCount(getPlayer(state, playerId));
  const { state: taken, cards } = takeTopCards(state, count);
  const next = discardCards(taken, cards);

  if (cards.length > 1) {
    const prompt: CheckChoicePrompt = { kind: 'CHOOSE_CHECK_CARD', actorId: playerId, reason, cards, shot };
    return { state: { ...next, prompt }, card: null, awaitingChoice: true };
  }

  return { state: next, card: cards[0] ?? null, awaitingChoice: false };
}

/** Счастливчик Люк выбрал карту проверки. */
export function takeChosenCheckCard(
  state: GameState,
  cardId: string,
): { state: GameState; prompt: CheckChoicePrompt; card: Card } | null {
  const { prompt } = state;
  if (prompt?.kind !== 'CHOOSE_CHECK_CARD') return null;
  const card = prompt.cards.find((candidate) => candidate.id === cardId);
  if (!card) return null;
  return { state: { ...state, prompt: null }, prompt, card };
}
