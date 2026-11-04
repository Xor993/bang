import { createNextPendingAction } from '../../../features/game-logic/actionUtils';
import { filterAliveTargets } from '../../../features/game-logic/playerFiltering';
import { applyDamageWithCharacterAbilities } from '../../../features/character-logic/damage';
import type { GameStore } from '../../types';

export function resolveRespondToBang(state: GameStore): Partial<GameStore> | GameStore {
  if (state.lastDrawnCardForCheck !== null) return state;

  const action = state.pendingAction;
  if (!action || action.type !== 'RESPOND_TO_BANG') return state;

  const damageResult = applyDamageWithCharacterAbilities(
    state.players,
    state.deck,
    state.discard,
    action.targetId,
    1,
    action.sourceId,
    { awardOutlaw: true },
  );

  const queueTargets = action.queueTargetIds ?? [];
  const aliveQueue = filterAliveTargets(queueTargets, damageResult.players);
  const nextPendingAction =
    !damageResult.winnerMessage && aliveQueue.length > 0
      ? createNextPendingAction({
          currentAction: action,
          players: damageResult.players,
          hasMoreItems: true,
        })
      : null;

  return {
    players: damageResult.players,
    deck: damageResult.deck,
    discard: damageResult.discard,
    pendingAction: nextPendingAction,
    targetingCardId: null,
    isTurnTransitionVisible: !damageResult.winnerMessage,
    winnerMessage: damageResult.winnerMessage,
    lastDrawnCardForCheck: null,
  };
}

export function resolveRespondToIndians(state: GameStore): Partial<GameStore> | GameStore {
  const action = state.pendingAction;
  if (!action || action.type !== 'RESPOND_TO_INDIANS') return state;

  const damageResult = applyDamageWithCharacterAbilities(
    state.players,
    state.deck,
    state.discard,
    action.targetId,
    1,
    action.sourceId,
    { awardOutlaw: true },
  );

  const queueTargets = action.queueTargetIds ?? [];
  const aliveQueue = filterAliveTargets(queueTargets, damageResult.players);
  const nextPendingAction =
    !damageResult.winnerMessage && aliveQueue.length > 0
      ? createNextPendingAction({
          currentAction: action,
          players: damageResult.players,
          hasMoreItems: true,
        })
      : null;

  return {
    players: damageResult.players,
    deck: damageResult.deck,
    discard: damageResult.discard,
    pendingAction: nextPendingAction,
    targetingCardId: null,
    isTurnTransitionVisible: !damageResult.winnerMessage,
    winnerMessage: damageResult.winnerMessage,
    lastDrawnCardForCheck: null,
  };
}

export function resolveRespondToDuel(state: GameStore): Partial<GameStore> | GameStore {
  const action = state.pendingAction;
  if (!action || action.type !== 'RESPOND_TO_DUEL') return state;
  if (!action.sourceId) return state;

  const damageResult = applyDamageWithCharacterAbilities(
    state.players,
    state.deck,
    state.discard,
    action.targetId,
    1,
    action.sourceId,
    { awardOutlaw: true },
  );

  return {
    players: damageResult.players,
    deck: damageResult.deck,
    discard: damageResult.discard,
    pendingAction: null,
    targetingCardId: null,
    isTurnTransitionVisible: !damageResult.winnerMessage,
    winnerMessage: damageResult.winnerMessage,
    lastDrawnCardForCheck: null,
  };
}
