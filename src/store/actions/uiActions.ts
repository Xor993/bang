import { drawFromState } from '../../features/game-logic/draw';
import { addCardToPlayerHand } from '../../features/game-logic/handUtils';
import type { GameActionSlice } from '../types';

export const createUiActions: GameActionSlice = (set) => ({
  setTargeting: (cardId) => set({ targetingCardId: cardId }),

  drawCard: (playerId: string) => {
    set((state) => {
      const { drawnCard, nextDeck, nextDiscard } = drawFromState(state.deck, state.discard);
      if (!drawnCard) return state;
      const nextPlayers = addCardToPlayerHand(state.players, playerId, drawnCard);

      return {
        deck: nextDeck,
        discard: nextDiscard,
        players: nextPlayers,
      };
    });
  },
});
