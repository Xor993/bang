/**
 * «Индейцы!» (стр. 8): «каждый другой игрок должен либо сбросить с руки карту "Бэнг!",
 * либо потерять единицу здоровья. Карты "Мимо!" и "Бочка" против "Индейцев" не помогают».
 */
import { getOtherAlivePlayers } from '../core/players';
import { dealDamage } from '../mechanics/health';
import type { GameState, IndiansPrompt } from '../types';

export const playIndians = (state: GameState, attackerId: string): GameState => ({
  ...state,
  queue: [
    ...getOtherAlivePlayers(state, attackerId).map(
      (target): IndiansPrompt => ({ kind: 'RESPOND_TO_INDIANS', actorId: target.id, attackerId }),
    ),
    ...state.queue,
  ],
});

/** Игрок сбросил «Бэнг!» — карта уже в сбросе. */
export const answerIndiansWithBang = (state: GameState): GameState => ({ ...state, prompt: null });

export function takeIndiansHit(state: GameState): GameState {
  const { prompt } = state;
  if (prompt?.kind !== 'RESPOND_TO_INDIANS') return state;
  return dealDamage({ ...state, prompt: null }, prompt.actorId, 1, prompt.attackerId);
}
