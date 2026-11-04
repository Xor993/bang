import type { GameState } from "../../shared/types/game";

export const applyBangEffect = (
  state: GameState,
  targetId: string,
  sourceId: string,
): Partial<GameState> => {
    if (!targetId) return {};
    const source = state.players.find((player) => player.id === sourceId);
    const missedRequired = source?.characterId === 'slab_the_killer' ? 2 : 1;

    return {
      pendingAction: {
        type: 'RESPOND_TO_BANG',
        targetId,
        sourceId,
        missedRequired,
        missedPlayed: 0,
      },
    };
};
