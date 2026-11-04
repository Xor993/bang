import { advanceTurn } from '../../features/game-logic/turnUtils';
import { removeCardFromPlayerHand } from '../../features/game-logic/handUtils';
import { applySuzyLafayette } from '../../features/character-logic/hand';
import type { GameActionSlice } from '../types';

export const createTurnActions: GameActionSlice = (set) => ({
  endTurn: () => {
    set((state) => {
      if (state.winnerMessage) return state;
      if (state.phase === 'DRAW') return state;
      const activePlayer = state.players.find((player) => player.id === state.activePlayerId);
      if (!activePlayer) return state;

      if (activePlayer.hand.length > activePlayer.currentHp) {
        return {
          phase: 'DISCARD_EXCESS',
          targetingCardId: null,
        };
      }

      return advanceTurn(state);
    });
  },

  acknowledgeTurn: () =>
    set((state) => ({
      isTurnTransitionVisible: false,
      ...(state.pendingAction?.type === 'RESPOND_TO_BANG' ||
      state.pendingAction?.type === 'RESPOND_TO_INDIANS' ||
      state.pendingAction?.type === 'RESPOND_TO_DUEL'
        ? { lastDrawnCardForCheck: null }
        : {}),
    })),

  discardCard: (cardId: string) => {
    set((state) => {
      if (state.phase !== 'DISCARD_EXCESS' || state.winnerMessage) return state;
      const activePlayer = state.players.find((player) => player.id === state.activePlayerId);
      const card = activePlayer?.hand.find((handCard) => handCard.id === cardId);

      if (!activePlayer || !card) {
        return state;
      }

      const nextPlayers = removeCardFromPlayerHand(state.players, activePlayer.id, cardId);
      const nextDiscard = [card, ...state.discard];
      const suzyResult = applySuzyLafayette(nextPlayers, state.deck, nextDiscard, [activePlayer.id]);
      const updatedActivePlayer = suzyResult.players.find((player) => player.id === activePlayer.id);

      if (updatedActivePlayer && updatedActivePlayer.hand.length > updatedActivePlayer.currentHp) {
        return {
          players: suzyResult.players,
          deck: suzyResult.deck,
          discard: suzyResult.discard,
          drawPulseCardIds: suzyResult.drawnCardIds.length > 0 ? suzyResult.drawnCardIds : state.drawPulseCardIds,
        };
      }

      return advanceTurn({
        ...state,
        players: suzyResult.players,
        deck: suzyResult.deck,
        discard: suzyResult.discard,
      });
    });
  },
});
