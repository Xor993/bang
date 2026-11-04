import type { Card } from '../../shared/types/game';
import { hasCharacter } from '../../features/character-logic/ids';
import { applySuzyLafayette } from '../../features/character-logic/hand';
import { healPlayer } from '../../features/character-logic/damage';
import { removeCardsFromPlayerHand } from '../../features/game-logic/handUtils';
import type { GameActionSlice } from '../types';

export const createCharacterActions: GameActionSlice = (set) => ({
  startSidKetchumHeal: () => {
    set((state) => {
      if (state.phase !== 'PLAY' || state.pendingAction || state.winnerMessage) return state;
      const activePlayer = state.players.find((player) => player.id === state.activePlayerId);
      if (
        !activePlayer ||
        !hasCharacter(activePlayer, 'sid_ketchum') ||
        activePlayer.currentHp >= activePlayer.maxHp ||
        activePlayer.hand.length < 2
      ) {
        return state;
      }

      return {
        pendingAction: { type: 'CHOOSE_SID_KETCHUM_DISCARD' as const, targetId: activePlayer.id, selectedCardIds: [] },
        targetingCardId: null,
        isTurnTransitionVisible: false,
      };
    });
  },

  chooseSidKetchumDiscard: (cardIds: string[]) => {
    set((state) => {
      const action = state.pendingAction;
      if (!action || action.type !== 'CHOOSE_SID_KETCHUM_DISCARD' || state.winnerMessage) return state;

      const player = state.players.find((p) => p.id === action.targetId);
      const uniqueCardIds = Array.from(new Set(cardIds));
      if (!player || uniqueCardIds.length !== 2 || player.currentHp >= player.maxHp) return state;

      const discardedCards = uniqueCardIds
        .map((cardId) => player.hand.find((card) => card.id === cardId))
        .filter((card): card is Card => Boolean(card));
      if (discardedCards.length !== 2) return state;

      let nextPlayers = removeCardsFromPlayerHand(state.players, player.id, uniqueCardIds);
      nextPlayers = healPlayer(nextPlayers, player.id, 1);
      const nextDiscard = [...discardedCards, ...state.discard];
      const suzyResult = applySuzyLafayette(nextPlayers, state.deck, nextDiscard, [player.id]);

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
