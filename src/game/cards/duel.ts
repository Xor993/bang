/**
 * «Дуэль» (стр. 8): вызванный игрок может сбросить «Бэнг!», затем вы, и так далее.
 * Кто первым не сбросит «Бэнг!», теряет единицу здоровья.
 * «Мимо!» и «Бочка» не помогают; сброшенные «Бэнг!» не считаются разыгранными.
 */
import { addLog } from '../core/log';
import { getPlayer } from '../core/players';
import { dealDamage } from '../mechanics/health';
import type { GameState } from '../types';

export const startDuel = (state: GameState, challengerId: string, targetId: string): GameState => ({
  ...state,
  prompt: { kind: 'RESPOND_TO_DUEL', actorId: targetId, opponentId: challengerId },
});

/** Игрок сбросил «Бэнг!» — теперь очередь соперника. */
export function answerDuelWithBang(state: GameState): GameState {
  const { prompt } = state;
  if (prompt?.kind !== 'RESPOND_TO_DUEL') return state;
  return { ...state, prompt: { ...prompt, actorId: prompt.opponentId, opponentId: prompt.actorId } };
}

export function loseDuel(state: GameState): GameState {
  const { prompt } = state;
  if (prompt?.kind !== 'RESPOND_TO_DUEL') return state;
  const logged = addLog({ ...state, prompt: null }, `${getPlayer(state, prompt.actorId).name} проигрывает дуэль.`);
  return dealDamage(logged, prompt.actorId, 1, prompt.opponentId);
}
