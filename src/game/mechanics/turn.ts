/**
 * Ход игры (стр. 3–4): проверки в начале хода → 1. Набор → 2. Розыгрыш → 3. Сброс → передача хода.
 * Набор описан отдельно — в drawPhase.ts.
 */
import { addToPlay, discardCards, discardFromHand, removeFromPlay } from '../core/cards';
import { addLog } from '../core/log';
import { findInPlay, getActivePlayer, getNextAlivePlayerId, getPlayer } from '../core/players';
import { formatCardFace } from '../data/cards';
import { getExcessCardCount } from '../rules/playability';
import type { Card, GameState, Player, TurnStartCheckPrompt } from '../types';
import { CHECK_LABELS, isCheckPassed, revealCheck } from './checks';
import { dealDamage } from './health';

const DYNAMITE_DAMAGE = 3;

// ─── Начало хода ────────────────────────────────────────────────────────────

/**
 * Проверки до фазы набора. «Если у вас в игре и "Динамит", и "Тюрьма",
 * первым проверяйте "Динамит"» (стр. 9).
 */
function getTurnStartChecks(player: Player): TurnStartCheckPrompt[] {
  const checks: TurnStartCheckPrompt[] = [];
  if (findInPlay(player, 'DYNAMITE')) checks.push({ kind: 'TURN_START_CHECK', actorId: player.id, reason: 'DYNAMITE' });
  if (findInPlay(player, 'JAIL')) checks.push({ kind: 'TURN_START_CHECK', actorId: player.id, reason: 'JAIL' });
  return checks;
}

/** Ход передаётся следующему живому игроку по часовой стрелке. */
export function passTurn(state: GameState): GameState {
  const nextPlayer = getPlayer(state, getNextAlivePlayerId(state, state.activePlayerId));
  const checks = getTurnStartChecks(nextPlayer);

  const next: GameState = {
    ...state,
    activePlayerId: nextPlayer.id,
    phase: checks.length > 0 ? 'TURN_START' : 'DRAW',
    bangsPlayedThisTurn: 0,
    prompt: null,
    queue: checks,
  };
  return addLog(next, `Ход переходит к игроку ${nextPlayer.name}.`);
}

/** Игрок нажал «Проверить» в начале хода. */
export function checkTurnStart(state: GameState): GameState {
  const { prompt } = state;
  if (prompt?.kind !== 'TURN_START_CHECK') return state;

  const revealed = revealCheck({ ...state, prompt: null }, prompt.actorId, prompt.reason);
  if (revealed.awaitingChoice) return revealed.state;
  return applyTurnStartCheck(revealed.state, prompt.actorId, prompt.reason, revealed.card);
}

export function applyTurnStartCheck(
  state: GameState,
  playerId: string,
  reason: 'DYNAMITE' | 'JAIL',
  card: Card | null,
): GameState {
  const passed = isCheckPassed(reason, card);
  const player = getPlayer(state, playerId);
  const face = card ? formatCardFace(card) : 'нет карты';
  const logged = addLog(state, `${player.name}: проверка ${CHECK_LABELS[reason]} — ${face}.`, card ?? undefined);

  return reason === 'DYNAMITE' ? resolveDynamite(logged, playerId, passed) : resolveJail(logged, playerId, passed);
}

/**
 * «Динамит» (стр. 9): на пике 2–9 взрывается — сбросьте его и потеряйте 3 единицы здоровья;
 * иначе передайте соседу слева. Никто не считается причиной ущерба от взрыва.
 */
function resolveDynamite(state: GameState, playerId: string, passed: boolean): GameState {
  const dynamite = findInPlay(getPlayer(state, playerId), 'DYNAMITE');
  if (!dynamite) return state;
  const removed = removeFromPlay(state, playerId, dynamite.id);

  if (passed) {
    const neighbourId = getNextAlivePlayerId(removed.state, playerId);
    const next = addToPlay(removed.state, neighbourId, removed.card);
    return addLog(next, `«Динамит» не взорвался и переходит к игроку ${getPlayer(next, neighbourId).name}.`);
  }

  const exploded = addLog(discardCards(removed.state, [removed.card]), '«Динамит» взрывается!');
  return dealDamage(exploded, playerId, DYNAMITE_DAMAGE);
}

/**
 * «Тюрьма» (стр. 9): черва — освобождается, сбрасывает «Тюрьму» и продолжает ход;
 * иначе тоже сбрасывает «Тюрьму», но пропускает весь ход.
 */
function resolveJail(state: GameState, playerId: string, passed: boolean): GameState {
  const jail = findInPlay(getPlayer(state, playerId), 'JAIL');
  if (!jail) return state;
  const removed = removeFromPlay(state, playerId, jail.id);
  const next = discardCards(removed.state, [removed.card]);
  const { name } = getPlayer(next, playerId);

  if (passed) return addLog(next, `${name} выходит из «Тюрьмы».`);
  return passTurn(addLog(next, `${name} остаётся за решёткой и пропускает ход.`));
}

// ─── Конец хода ─────────────────────────────────────────────────────────────

/** «Предел руки равен числу оставшихся у вас к концу хода патронов» (стр. 4). */
export function endTurn(state: GameState): GameState {
  const player = getActivePlayer(state);
  const excess = getExcessCardCount(player);
  if (excess === 0) return passTurn(state);
  return addLog({ ...state, phase: 'DISCARD' }, `${player.name} должен сбросить лишние карты: ${excess}.`);
}

/** Фаза сброса закончится сама, как только карт на руке станет не больше здоровья. */
export const finishDiscardIfDone = (state: GameState): GameState =>
  state.phase === 'DISCARD' && getExcessCardCount(getActivePlayer(state)) === 0 ? passTurn(state) : state;

export const discardExcessCard = (state: GameState, cardId: string): GameState =>
  finishDiscardIfDone(discardFromHand(state, state.activePlayerId, cardId));
