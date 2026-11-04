/**
 * «Бэнг!», «Гатлинг» и защита от попадания: «Мимо!», «Бочка», бочка Человека-без-Имени (стр. 5–9).
 */
import { addLog } from '../core/log';
import { getOtherAlivePlayers, getPlayer } from '../core/players';
import { formatCardFace } from '../data/cards';
import { CHECK_LABELS, isCheckPassed, revealCheck } from '../mechanics/checks';
import { dealDamage } from '../mechanics/health';
import { getMissedNeeded } from '../rules/characterRules';
import type { Card, GameState, ShotPrompt } from '../types';

function createShot(state: GameState, attackerId: string, targetId: string, cardKind: ShotPrompt['cardKind']): ShotPrompt {
  return {
    kind: 'RESPOND_TO_SHOT',
    actorId: targetId,
    attackerId,
    cardKind,
    missedNeeded: getMissedNeeded(getPlayer(state, attackerId), cardKind),
    missedPlayed: 0,
    barrelUsed: false,
    abilityUsed: false,
  };
}

// ─── Атака ──────────────────────────────────────────────────────────────────

/** «Бэнг!»: цель должна ответить «Мимо!» или потерять единицу здоровья. */
export const shootBang = (state: GameState, attackerId: string, targetId: string): GameState => ({
  ...state,
  prompt: createShot(state, attackerId, targetId, 'BANG'),
});

/** «Гатлинг»: «каждый другой игрок, независимо от расстояния, получает одно попадание» — по часовой стрелке. */
export const shootGatling = (state: GameState, attackerId: string): GameState => ({
  ...state,
  queue: [
    ...getOtherAlivePlayers(state, attackerId).map((target) => createShot(state, attackerId, target.id, 'GATLING')),
    ...state.queue,
  ],
});

// ─── Защита ─────────────────────────────────────────────────────────────────

/** Засчитывает одну отмену. Ангельским Глазкам нужно две. */
function registerMissed(state: GameState, shot: ShotPrompt): GameState {
  const missedPlayed = shot.missedPlayed + 1;
  const { name } = getPlayer(state, shot.actorId);

  if (missedPlayed < shot.missedNeeded) {
    return addLog({ ...state, prompt: { ...shot, missedPlayed } }, `${name}: нужно ещё одно «Мимо!».`);
  }
  return addLog({ ...state, prompt: null }, `${name} уклоняется от попадания.`);
}

/** Цель сыграла «Мимо!» (или «Бэнг!» за Бедовую Джейн); карта уже сброшена. */
export function answerShotWithMissed(state: GameState): GameState {
  const { prompt } = state;
  return prompt?.kind === 'RESPOND_TO_SHOT' ? registerMissed(state, prompt) : state;
}

/** Проверка «Бочки» или встроенной бочки Человека-без-Имени: черва отменяет попадание. */
export function defendWithCheck(state: GameState, source: 'BARREL' | 'JOURDONNAIS'): GameState {
  const { prompt } = state;
  if (prompt?.kind !== 'RESPOND_TO_SHOT') return state;

  const shot: ShotPrompt = source === 'BARREL' ? { ...prompt, barrelUsed: true } : { ...prompt, abilityUsed: true };
  const revealed = revealCheck({ ...state, prompt: null }, shot.actorId, source, shot);
  if (revealed.awaitingChoice) return revealed.state;
  return applyDefenseCheck(revealed.state, shot, source, revealed.card);
}

export function applyDefenseCheck(
  state: GameState,
  shot: ShotPrompt,
  source: 'BARREL' | 'JOURDONNAIS',
  card: Card | null,
): GameState {
  const passed = isCheckPassed(source, card);
  const face = card ? formatCardFace(card) : 'нет карты';
  const result = passed ? 'попадание отменено' : 'не помогло';
  const logged = addLog(state, `${getPlayer(state, shot.actorId).name}: ${CHECK_LABELS[source]} — ${face}, ${result}.`, card ?? undefined);

  return passed ? registerMissed(logged, shot) : { ...logged, prompt: shot };
}

/** Цель не отменила попадание и теряет единицу здоровья. */
export function takeShot(state: GameState): GameState {
  const { prompt } = state;
  if (prompt?.kind !== 'RESPOND_TO_SHOT') return state;
  return dealDamage({ ...state, prompt: null }, prompt.actorId, 1, prompt.attackerId);
}
