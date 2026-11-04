import { createNextPendingAction } from '../../features/game-logic/actionUtils';
import { filterAliveTargets } from '../../features/game-logic/playerFiltering';
import { addCardToPlayerHand } from '../../features/game-logic/handUtils';
import { selectCardFromHandOrEquipment, removeCardFromPlayer } from '../../features/game-logic/cardSelection';
import { applySuzyLafayette } from '../../features/character-logic/hand';
import type { GameActionSlice } from '../types';

export const createCardChoiceActions: GameActionSlice = (set) => ({
  chooseGeneralStoreCard: (cardId: string) => {
    set((state) => {
      const action = state.pendingAction;
      if (!action || action.type !== 'CHOOSE_GENERAL_STORE_CARD' || state.winnerMessage) {
        return state;
      }
      const pickedCard = state.generalStoreCards.find((card) => card.id === cardId);
      if (!pickedCard) return state;

      const nextPlayers = addCardToPlayerHand(state.players, action.targetId, pickedCard);
      const nextGeneralStoreCards = state.generalStoreCards.filter((card) => card.id !== cardId);

      const queueTargets = action.queueTargetIds ?? [];
      const aliveQueue = filterAliveTargets(queueTargets, nextPlayers);

      const nextPendingAction =
        nextGeneralStoreCards.length > 0 && aliveQueue.length > 0
          ? createNextPendingAction({
              currentAction: action,
              players: nextPlayers,
              hasMoreItems: true,
            })
          : null;

      return {
        players: nextPlayers,
        generalStoreCards: nextPendingAction ? nextGeneralStoreCards : [],
        pendingAction: nextPendingAction,
        targetingCardId: null,
        isTurnTransitionVisible: false,
      };
    });
  },

  choosePanicSteal: (mode: 'hand' | 'equipment', equipmentCardId?: string) => {
    set((state) => {
      const action = state.pendingAction;
      if (!action || action.type !== 'CHOOSE_CARD_TO_STEAL' || !action.sourceId || state.winnerMessage) {
        return state;
      }
      const sourcePlayer = state.players.find((player) => player.id === action.sourceId);
      const targetPlayer = state.players.find((player) => player.id === action.targetId);
      if (!sourcePlayer || !targetPlayer || targetPlayer.isEliminated) return state;

      const stolenCard = selectCardFromHandOrEquipment(mode, targetPlayer, equipmentCardId);
      if (!stolenCard) return state;

      const isFromHand = mode === 'hand';
      let nextPlayers = removeCardFromPlayer(state.players, targetPlayer.id, stolenCard.id, isFromHand);
      nextPlayers = addCardToPlayerHand(nextPlayers, sourcePlayer.id, stolenCard);
      const suzyResult = isFromHand
        ? applySuzyLafayette(nextPlayers, state.deck, state.discard, [targetPlayer.id])
        : { players: nextPlayers, deck: state.deck, discard: state.discard, drawnCardIds: [] };

      return {
        players: suzyResult.players,
        deck: suzyResult.deck,
        discard: suzyResult.discard,
        pendingAction: null,
        targetingCardId: null,
        isTurnTransitionVisible: false,
      };
    });
  },

  chooseCatBalouDiscard: (mode: 'hand' | 'equipment', equipmentCardId?: string) => {
    set((state) => {
      const action = state.pendingAction;
      if (!action || action.type !== 'CHOOSE_CARD_TO_DISCARD' || state.winnerMessage) {
        return state;
      }
      const targetPlayer = state.players.find((player) => player.id === action.targetId);
      if (!targetPlayer || targetPlayer.isEliminated) return state;

      const discardedCard = selectCardFromHandOrEquipment(mode, targetPlayer, equipmentCardId);
      if (!discardedCard) return state;

      const isFromHand = mode === 'hand';
      const nextPlayers = removeCardFromPlayer(state.players, targetPlayer.id, discardedCard.id, isFromHand);
      const nextDiscard = [discardedCard, ...state.discard];
      const suzyResult = isFromHand
        ? applySuzyLafayette(nextPlayers, state.deck, nextDiscard, [targetPlayer.id])
        : { players: nextPlayers, deck: state.deck, discard: nextDiscard, drawnCardIds: [] };

      return {
        players: suzyResult.players,
        deck: suzyResult.deck,
        discard: suzyResult.discard,
        pendingAction: null,
        targetingCardId: null,
        isTurnTransitionVisible: false,
      };
    });
  },
});
