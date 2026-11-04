import { applyMissedEffect } from '../../features/card-effect/missed';
import { checkBarrelStop, checkResultFromCard } from '../../features/game-logic/checkUtils';
import { drawCheckCardsForPlayer } from '../../features/character-logic/checks';
import { hasCharacter } from '../../features/character-logic/ids';
import type { GameActionSlice } from '../types';

export const createCheckActions: GameActionSlice = (set) => ({
  checkDynamite: () => {
    set((state) => {
      if (state.pendingAction?.type !== 'CHECK_DYNAMITE') return state;

      const target = state.players.find((player) => player.id === state.pendingAction?.targetId);
      const checkResult = drawCheckCardsForPlayer(target, state.deck, state.discard);
      if (!checkResult.chosenCard && !checkResult.checkCards) return state;

      return {
        deck: checkResult.deck,
        discard: checkResult.discard,
        lastDrawnCardForCheck: checkResult.chosenCard,
        pendingAction: { ...state.pendingAction, checkCards: checkResult.checkCards ?? undefined },
      };
    });
  },

  checkJail: () => {
    set((state) => {
      if (state.pendingAction?.type !== 'CHECK_JAIL') return state;

      const target = state.players.find((player) => player.id === state.pendingAction?.targetId);
      const checkResult = drawCheckCardsForPlayer(target, state.deck, state.discard);
      if (!checkResult.chosenCard && !checkResult.checkCards) return state;

      return {
        deck: checkResult.deck,
        discard: checkResult.discard,
        lastDrawnCardForCheck: checkResult.chosenCard,
        pendingAction: { ...state.pendingAction, checkCards: checkResult.checkCards ?? undefined },
      };
    });
  },

  drawBarrelCheck: () => {
    set((state) => {
      const action = state.pendingAction;
      if (action?.type !== 'RESPOND_TO_BANG') return state;
      if (action.barrelCheckUsed) return state;
      if (state.lastDrawnCardForCheck !== null) return state;

      const target = state.players.find((p) => p.id === action.targetId);
      if (!target?.equipment.some((c) => c.effectType === 'BARREL')) return state;

      const checkResult = drawCheckCardsForPlayer(target, state.deck, state.discard);
      if (!checkResult.chosenCard && !checkResult.checkCards) return state;

      return {
        deck: checkResult.deck,
        discard: checkResult.discard,
        lastDrawnCardForCheck: checkResult.chosenCard,
        pendingAction: { ...action, barrelCheckUsed: true, checkCards: checkResult.checkCards ?? undefined },
      };
    });
  },

  drawJourdonnaisCheck: () => {
    set((state) => {
      const action = state.pendingAction;
      if (action?.type !== 'RESPOND_TO_BANG') return state;
      if (action.jourdonnaisCheckUsed) return state;
      if (state.lastDrawnCardForCheck !== null) return state;

      const target = state.players.find((p) => p.id === action.targetId);
      if (!hasCharacter(target, 'jourdonnais')) return state;

      const checkResult = drawCheckCardsForPlayer(target, state.deck, state.discard);
      if (!checkResult.chosenCard && !checkResult.checkCards) return state;

      return {
        deck: checkResult.deck,
        discard: checkResult.discard,
        lastDrawnCardForCheck: checkResult.chosenCard,
        pendingAction: { ...action, jourdonnaisCheckUsed: true, checkCards: checkResult.checkCards ?? undefined },
      };
    });
  },

  chooseLuckyDukeCheck: (cardId: string) => {
    set((state) => {
      const action = state.pendingAction;
      const chosenCard = action?.checkCards?.find((card) => card.id === cardId);
      if (!action || !chosenCard) return state;

      return {
        lastDrawnCardForCheck: chosenCard,
        pendingAction: { ...action, checkCards: undefined },
      };
    });
  },

  resolveBarrelCheck: () => {
    set((state) => {
      if (state.pendingAction?.type !== 'RESPOND_TO_BANG') return state;
      const drawn = state.lastDrawnCardForCheck;
      if (!drawn) return state;

      if (checkBarrelStop(checkResultFromCard(drawn))) {
        const missPartial = applyMissedEffect(state);
        const bangDone = missPartial.pendingAction === null || missPartial.pendingAction === undefined;
        return {
          ...missPartial,
          lastDrawnCardForCheck: null,
          targetingCardId: null,
          isTurnTransitionVisible: bangDone && !state.winnerMessage,
        };
      }

      return { lastDrawnCardForCheck: null };
    });
  },
});
