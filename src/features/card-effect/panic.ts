import type { GameState } from "../../shared/types/game"

export const applyPanicEffect = (state: GameState, sourceId: string, targetId: string): Partial<GameState> => {
    const sourcePlayer = state.players.find((p) => p.id === sourceId);
    const targetPlayer = state.players.find((p) => p.id === targetId);

    if (!sourcePlayer || !targetPlayer || targetPlayer.isEliminated) return {};
    if (targetPlayer.hand.length === 0 && targetPlayer.equipment.length === 0) return {};

    return {
      pendingAction: {
        type: 'CHOOSE_CARD_TO_STEAL',
        sourceId,
        targetId,
      },
    };
}