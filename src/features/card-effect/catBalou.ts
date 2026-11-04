import type { GameState } from "../../shared/types/game";

export const applyCatBalouEffect = (
  state: GameState,
  sourceId: string,
  targetId: string,
): Partial<GameState> => {
  const sourcePlayer = state.players.find((player) => player.id === sourceId);
  const targetPlayer = state.players.find((player) => player.id === targetId);

  if (!sourcePlayer || !targetPlayer || targetPlayer.isEliminated) return {};
  if (targetPlayer.hand.length === 0 && targetPlayer.equipment.length === 0) return {};

  return {
    pendingAction: {
      type: 'CHOOSE_CARD_TO_DISCARD',
      sourceId,
      targetId,
    },
  };
};
