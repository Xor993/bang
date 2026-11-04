import { getNextAlivePlayerIndex } from "./playerUtils";
import type { ExtendedState } from "../../store/extendedState";

export const advanceTurn = (state: ExtendedState) => {
  const currentIndex = state.players.findIndex((player) => player.id === state.activePlayerId);
  const nextIndex = getNextAlivePlayerIndex(state.players, currentIndex);
  const nextPlayerId = state.players[nextIndex].id;
  const nextPlayer = state.players[nextIndex];

  if (nextPlayer.equipment.some((card) => card.effectType === 'DYNAMITE')) {
    return {
      activePlayerId: nextPlayerId,
      phase: 'CHECK_PENALTIES' as const,
      players: state.players,
      deck: state.deck,
      discard: state.discard,
      bangsPlayedThisTurn: 0,
      generalStoreCards: [],
      pendingAction: {
        type: 'CHECK_DYNAMITE' as const,
        targetId: nextPlayerId,
      },
      targetingCardId: null,
      isTurnTransitionVisible: true,
      lastDrawnCardForCheck: null,
      drawPulseCardIds: null,
    };
  }

  // Если игрок в тюрьме, нужно проверить может ли он выйти
  if (nextPlayer.isInJail) {
    return {
      activePlayerId: nextPlayerId,
      phase: 'CHECK_PENALTIES' as const,
      players: state.players,
      deck: state.deck,
      discard: state.discard,
      bangsPlayedThisTurn: 0,
      generalStoreCards: [],
      pendingAction: {
        type: 'CHECK_JAIL' as const,
        targetId: nextPlayerId,
      },
      targetingCardId: null,
      isTurnTransitionVisible: true,
      lastDrawnCardForCheck: null,
      drawPulseCardIds: null,
    };
  }

  return {
    activePlayerId: nextPlayerId,
    phase: 'DRAW' as const,
    players: state.players,
    deck: state.deck,
    discard: state.discard,
    bangsPlayedThisTurn: 0,
    generalStoreCards: [],
    pendingAction: null,
    targetingCardId: null,
    isTurnTransitionVisible: true,
    lastDrawnCardForCheck: null,
    drawPulseCardIds: null,
  };
};