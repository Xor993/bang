import { hasCharacter } from '../../features/character-logic/ids';
import {
  drawBlackJackBonusIfNeeded,
  drawBlackJackInitialCards,
  drawJesseJones,
  drawPedroRamirez,
  drawStandardOrBlackJack,
  finishKitCarsonDraw,
  revealKitCarsonCards,
} from '../../features/character-logic/drawPhase';
import type { GameActionSlice } from '../types';

const scheduleDrawPulseClear = (set: Parameters<GameActionSlice>[0]) => {
  window.setTimeout(() => {
    set({ drawPulseCardIds: null });
  }, 900);
};

export const createDrawPhaseActions: GameActionSlice = (set) => ({
  drawTwoFromDeck: () => {
    set((state) => {
      if (state.phase !== 'DRAW' || state.winnerMessage || state.pendingAction !== null) return state;
      const activePlayer = state.players.find((player) => player.id === state.activePlayerId);
      if (!activePlayer) return state;

      if (hasCharacter(activePlayer, 'pedro_ramirez') && state.discard.length > 0) {
        return {
          pendingAction: { type: 'CHOOSE_DRAW_SOURCE' as const, targetId: activePlayer.id },
          isTurnTransitionVisible: false,
        };
      }

      if (
        hasCharacter(activePlayer, 'jesse_jones') &&
        state.players.some((player) => player.id !== activePlayer.id && !player.isEliminated && player.hand.length > 0)
      ) {
        return {
          pendingAction: { type: 'CHOOSE_DRAW_SOURCE' as const, targetId: activePlayer.id },
          isTurnTransitionVisible: false,
        };
      }

      if (hasCharacter(activePlayer, 'kit_carson')) {
        const revealResult = revealKitCarsonCards(state.deck, state.discard);
        if (revealResult.revealedCards.length === 0) return state;

        return {
          deck: revealResult.deck,
          discard: revealResult.discard,
          pendingAction: {
            type: 'CHOOSE_KIT_CARSON_CARD' as const,
            targetId: activePlayer.id,
            revealedCards: revealResult.revealedCards,
          },
          isTurnTransitionVisible: false,
        };
      }

      if (hasCharacter(activePlayer, 'black_jack')) {
        const drawResult = drawBlackJackInitialCards(
          state.players,
          state.activePlayerId,
          state.deck,
          state.discard,
        );

        if (drawResult.drawnCards.length === 0) return state;

        return {
          players: drawResult.players,
          deck: drawResult.deck,
          discard: drawResult.discard,
          pendingAction: {
            type: 'RESOLVE_BLACK_JACK_DRAW' as const,
            targetId: activePlayer.id,
            revealedCards: drawResult.drawnCards,
          },
          isTurnTransitionVisible: false,
          drawPulseCardIds: drawResult.drawnCards.map((card) => card.id),
        };
      }

      const drawResult = drawStandardOrBlackJack(
        state.players,
        state.activePlayerId,
        state.deck,
        state.discard,
      );

      const drawnIds = drawResult.drawnCards.map((c) => c.id);
      scheduleDrawPulseClear(set);

      return {
        players: drawResult.players,
        deck: drawResult.deck,
        discard: drawResult.discard,
        phase: 'PLAY' as const,
        drawPulseCardIds: drawnIds.length > 0 ? drawnIds : null,
      };
    });
  },

  chooseDrawSource: (source: 'deck' | 'discard' | 'player', sourcePlayerId?: string) => {
    set((state) => {
      const action = state.pendingAction;
      if (!action || action.type !== 'CHOOSE_DRAW_SOURCE' || state.winnerMessage) return state;

      const activePlayer = state.players.find((player) => player.id === action.targetId);
      if (!activePlayer || activePlayer.id !== state.activePlayerId || state.phase !== 'DRAW') return state;

      const drawResult = hasCharacter(activePlayer, 'jesse_jones')
        ? drawJesseJones(
            state.players,
            activePlayer.id,
            source === 'player' ? 'player' : 'deck',
            sourcePlayerId,
            state.deck,
            state.discard,
          )
        : drawPedroRamirez(
            state.players,
            activePlayer.id,
            source === 'discard' ? 'discard' : 'deck',
            state.deck,
            state.discard,
          );

      const drawnIds = drawResult.drawnCards.map((card) => card.id);
      scheduleDrawPulseClear(set);

      return {
        players: drawResult.players,
        deck: drawResult.deck,
        discard: drawResult.discard,
        phase: 'PLAY' as const,
        pendingAction: null,
        targetingCardId: null,
        isTurnTransitionVisible: false,
        drawPulseCardIds: drawnIds.length > 0 ? drawnIds : null,
      };
    });
  },

  resolveBlackJackDraw: () => {
    set((state) => {
      const action = state.pendingAction;
      if (!action || action.type !== 'RESOLVE_BLACK_JACK_DRAW' || state.winnerMessage) return state;

      const activePlayer = state.players.find((player) => player.id === action.targetId);
      if (!activePlayer || activePlayer.id !== state.activePlayerId || state.phase !== 'DRAW') return state;

      const bonusResult = drawBlackJackBonusIfNeeded(
        state.players,
        activePlayer.id,
        action.revealedCards ?? [],
        state.deck,
        state.discard,
      );

      const bonusIds = bonusResult.drawnCards.map((card) => card.id);
      scheduleDrawPulseClear(set);

      return {
        players: bonusResult.players,
        deck: bonusResult.deck,
        discard: bonusResult.discard,
        phase: 'PLAY' as const,
        pendingAction: null,
        targetingCardId: null,
        isTurnTransitionVisible: false,
        drawPulseCardIds: bonusIds.length > 0 ? bonusIds : null,
      };
    });
  },

  chooseKitCarsonReturn: (cardId: string) => {
    set((state) => {
      const action = state.pendingAction;
      if (!action || action.type !== 'CHOOSE_KIT_CARSON_CARD' || state.winnerMessage) return state;

      const revealedCards = action.revealedCards ?? [];
      const returnCard = revealedCards.find((card) => card.id === cardId);
      if (!returnCard || state.phase !== 'DRAW' || action.targetId !== state.activePlayerId) return state;

      const keepCards = revealedCards.filter((card) => card.id !== cardId);
      const drawResult = finishKitCarsonDraw(state.players, action.targetId, state.deck, returnCard, keepCards);
      const drawnIds = drawResult.drawnCards.map((card) => card.id);
      scheduleDrawPulseClear(set);

      return {
        players: drawResult.players,
        deck: drawResult.deck,
        phase: 'PLAY' as const,
        pendingAction: null,
        targetingCardId: null,
        isTurnTransitionVisible: false,
        drawPulseCardIds: drawnIds.length > 0 ? drawnIds : null,
      };
    });
  },
});
