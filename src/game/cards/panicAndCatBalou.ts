/**
 * «Паника!» и «Красотка» (стр. 7): выбранный игрок теряет карту — случайную с руки
 * либо выбранную вами карту из игры. «Паника!» забирает её себе, «Красотка» — в сброс.
 * Цели проверяются в rules/playability.ts («Паника!» — только на расстоянии 1).
 */
import { addToHand, discardCards, removeFromPlay, removeRandomFromHand } from '../core/cards';
import { addLog } from '../core/log';
import { getPlayer } from '../core/players';
import type { Card, GameState, OpponentCardPrompt } from '../types';

export const chooseOpponentCard = (
  state: GameState,
  attackerId: string,
  victimId: string,
  cardKind: OpponentCardPrompt['cardKind'],
): GameState => ({
  ...state,
  prompt: { kind: 'CHOOSE_OPPONENT_CARD', actorId: attackerId, victimId, cardKind },
});

function takeVictimCard(
  state: GameState,
  victimId: string,
  zone: 'hand' | 'inPlay',
  cardId: string | undefined,
): { state: GameState; card: Card | null } {
  if (zone === 'hand') return removeRandomFromHand(state, victimId);
  const owned = getPlayer(state, victimId).inPlay.some((card) => card.id === cardId);
  return owned && cardId ? removeFromPlay(state, victimId, cardId) : { state, card: null };
}

export function pickOpponentCard(state: GameState, zone: 'hand' | 'inPlay', cardId?: string): GameState {
  const { prompt } = state;
  if (prompt?.kind !== 'CHOOSE_OPPONENT_CARD') return state;

  const taken = takeVictimCard({ ...state, prompt: null }, prompt.victimId, zone, cardId);
  if (!taken.card) return state;

  const attacker = getPlayer(state, prompt.actorId);
  const victim = getPlayer(state, prompt.victimId);

  if (prompt.cardKind === 'PANIC') {
    // Карта с руки уходит вслепую — её не показываем остальным
    const what = zone === 'hand' ? 'случайную карту с руки' : `«${taken.card.name}» из игры`;
    return addLog(addToHand(taken.state, attacker.id, [taken.card]), `${attacker.name} забирает у ${victim.name} ${what}.`);
  }

  const from = zone === 'hand' ? 'с руки' : 'из игры';
  return addLog(discardCards(taken.state, [taken.card]), `${victim.name} сбрасывает «${taken.card.name}» ${from}.`, taken.card);
}
