import { gameApi } from '../../shared/api/gameApi';
import type { GameActionSlice } from '../types';

let initRequestId = 0;

export const createInitGameActions: GameActionSlice = (set) => ({
  initGame: async (name: string) => {
    const requestId = ++initRequestId;
    set({ isLoading: true });

    try {
      const data = await gameApi.createGame(name);
      if (requestId !== initRequestId) return;

      const firstPlayerId = data.players[0].id;

      set({
        players: data.players,
        deck: data.deck,
        discard: [],
        activePlayerId: firstPlayerId,
        phase: 'DRAW',
        bangsPlayedThisTurn: 0,
        generalStoreCards: [],
        isLoading: false,
        isTurnTransitionVisible: true,
        winnerMessage: null,
        lastDrawnCardForCheck: null,
        drawPulseCardIds: null,
      });
    } catch (error) {
      console.error('Ошибка запуска игры', error);
      if (requestId === initRequestId) {
        set({ isLoading: false });
      }
    }
  },
});
