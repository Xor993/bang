import type { Card } from '../../shared/types/game';
import { resolveCardEffect } from '../../features/card-effect';
import { moveCardToEquipment } from '../../features/game-logic/playerUtils';
import { removeCardFromPlayerHand } from '../../features/game-logic/handUtils';
import { canApplyJail, syncInJailWithEquipment } from '../../features/card-effect/jail';
import { applySuzyLafayette } from '../../features/character-logic/hand';
import { shouldStayOnCurrentScreen as shouldKeepScreenForPendingAction } from '../../shared/pendingActions';
import { getVisiblePlayerId } from '../utils/getVisiblePlayerId';
import type { GameActionSlice } from '../types';

export const createPlayCardAction: GameActionSlice = (set, get) => ({
  playCard: (cardId: string, targetId?: string) => {
    const state = get();
    if (state.winnerMessage) return;
    const visiblePlayerId = getVisiblePlayerId(state);
    const player = state.players.find((currentPlayer) => currentPlayer.id === visiblePlayerId);
    const card = player?.hand.find((currentCard) => currentCard.id === cardId);
    if (!player || !card) return;

    if (card.effectType === 'BEER' && player.currentHp >= player.maxHp) return;

    if (card.effectType === 'JAIL' && !canApplyJail(player, targetId, state)) return;

    const stateChanges = resolveCardEffect(card, player, state, targetId);
    let nextPlayers = stateChanges.players || [...state.players];
    let nextDeck = stateChanges.deck ?? state.deck;
    let nextDiscard = [...(stateChanges.discard ?? state.discard)];
    let nextBangsPlayedThisTurn = state.bangsPlayedThisTurn;

    nextPlayers = removeCardFromPlayerHand(nextPlayers, player.id, card.id);

    const countsAsBang =
      card.effectType === 'BANG' || (card.effectType === 'MISSED' && player.characterId === 'calamity_janet');
    if (countsAsBang && state.activePlayerId === player.id && state.pendingAction === null) {
      nextBangsPlayedThisTurn += 1;
    }

    const nextPendingActionType = stateChanges.pendingAction?.type;
    const isSameResponderStillAnsweringBang =
      state.pendingAction?.type === 'RESPOND_TO_BANG' &&
      stateChanges.pendingAction?.type === 'RESPOND_TO_BANG' &&
      stateChanges.pendingAction.targetId === state.pendingAction.targetId;
    const shouldStayOnCurrentScreen =
      shouldKeepScreenForPendingAction(nextPendingActionType) ||
      isSameResponderStillAnsweringBang;

    let replacedEquipmentCard: Card | null = null;

    if (card.color === 'blue') {
      if (card.effectType === 'JAIL' && targetId) {
        nextPlayers = nextPlayers.map((p) =>
          p.id === targetId
            ? syncInJailWithEquipment({ ...p, equipment: [...p.equipment, card] })
            : p,
        );
      } else {
        const equipmentResult = moveCardToEquipment(nextPlayers, player.id, card);
        nextPlayers = equipmentResult.nextPlayers;
        replacedEquipmentCard = equipmentResult.replacedEquipmentCard;
      }

      if (replacedEquipmentCard) {
        nextDiscard = [replacedEquipmentCard, ...nextDiscard];
      }
    } else {
      nextDiscard = [card, ...nextDiscard];
    }

    const suzyResult = applySuzyLafayette(nextPlayers, nextDeck, nextDiscard, [player.id]);
    nextPlayers = suzyResult.players;
    nextDeck = suzyResult.deck;
    nextDiscard = suzyResult.discard;

    const nextPendingAction = stateChanges.pendingAction;
    const shouldClearCheckCard =
      card.effectType === 'MISSED' ||
      (card.effectType === 'BANG' && state.pendingAction?.type === 'RESPOND_TO_BANG') ||
      nextPendingAction?.type === 'RESPOND_TO_BANG' ||
      (state.pendingAction?.type === 'RESPOND_TO_BANG' &&
        nextPendingAction?.targetId != null &&
        nextPendingAction.targetId !== state.pendingAction.targetId);

    set({
      ...stateChanges,
      players: nextPlayers,
      deck: nextDeck,
      discard: nextDiscard,
      generalStoreCards: stateChanges.generalStoreCards ?? state.generalStoreCards,
      bangsPlayedThisTurn: nextBangsPlayedThisTurn,
      targetingCardId: null,
      ...(shouldClearCheckCard ? { lastDrawnCardForCheck: null } : {}),
      isTurnTransitionVisible: shouldStayOnCurrentScreen
        ? false
        : state.pendingAction !== null || stateChanges.pendingAction !== undefined
          ? true
          : state.isTurnTransitionVisible,
    });
  },
});
