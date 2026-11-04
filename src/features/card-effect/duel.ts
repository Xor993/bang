import type { GameState } from '../../shared/types/game';

export const applyDuelEffect = (
  state: GameState,
  challengerId: string,
  challengedId: string,
): Partial<GameState> => {
  const challenged = state.players.find((p) => p.id === challengedId);
  if (!challenged || challenged.isEliminated || challengedId === challengerId) {
    return {};
  }

  return {
    pendingAction: {
      type: 'RESPOND_TO_DUEL',
      sourceId: challengerId,
      targetId: challengedId,
    },
  };
};

export const applyDuelBangDiscardEffect = (state: GameState): Partial<GameState> => {
  const action = state.pendingAction;
  if (!action || action.type !== 'RESPOND_TO_DUEL' || !action.sourceId) {
    return {};
  }

  return {
    pendingAction: {
      ...action,
      targetId: action.sourceId,
      sourceId: action.targetId,
    },
  };
};
