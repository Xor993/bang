import { drawFromState } from "../game-logic/draw";
import type { Card, GameState, Player } from "../../shared/types/game";

const getAliveOrderFromPlayer = (players: Player[], startPlayerId: string): Player[] => {
  const startIndex = players.findIndex((player) => player.id === startPlayerId);
  if (startIndex === -1) return [];

  const ordered = [
    ...players.slice(startIndex),
    ...players.slice(0, startIndex),
  ];

  return ordered.filter((player) => !player.isEliminated);
};

export const applyGeneralStoreEffect = (state: GameState, sourcePlayerId: string): Partial<GameState> => {
  const alivePlayers = state.players.filter((player) => !player.isEliminated);
  if (alivePlayers.length === 0) return {};

  let nextDeck = [...state.deck];
  let nextDiscard = [...state.discard];
  const revealedCards: Card[] = [];

  for (let i = 0; i < alivePlayers.length; i += 1) {
    const drawResult = drawFromState(nextDeck, nextDiscard);
    nextDeck = drawResult.nextDeck;
    nextDiscard = drawResult.nextDiscard;

    if (drawResult.drawnCard) {
      revealedCards.push(drawResult.drawnCard);
    }
  }

  if (revealedCards.length === 0) {
    return {};
  }

  const pickOrder = getAliveOrderFromPlayer(state.players, sourcePlayerId);
  if (pickOrder.length === 0) return {};

  return {
    deck: nextDeck,
    discard: nextDiscard,
    generalStoreCards: revealedCards,
    pendingAction: {
      type: 'CHOOSE_GENERAL_STORE_CARD',
      sourceId: sourcePlayerId,
      targetId: pickOrder[0].id,
      queueTargetIds: pickOrder.slice(1).map((player) => player.id),
    },
  };
};
