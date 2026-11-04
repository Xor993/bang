import type { GameState } from '../../shared/types/game';

export const applyIndiansEffect = (state: GameState, sourceId: string): Partial<GameState> => {
  const targets = state.players.filter(p => !p.isEliminated && p.id !== sourceId);
  
  if (targets.length === 0) {
    return {};
  }

  return {
    pendingAction: {
      type: 'RESPOND_TO_INDIANS',
      sourceId,
      targetId: targets[0].id,
      queueTargetIds: targets.slice(1).map(p => p.id),
    },
  };
};