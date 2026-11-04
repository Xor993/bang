import type { Card, Player } from '../../shared/types/game';

export const addCardToPlayerHand = (players: Player[], playerId: string, card: Card) =>
  players.map((player) =>
    player.id === playerId
      ? { ...player, hand: [...player.hand, card] }
      : player,
  );

export const addCardsToPlayerHand = (players: Player[], playerId: string, cards: Card[]) =>
  players.map((player) =>
    player.id === playerId
      ? { ...player, hand: [...player.hand, ...cards] }
      : player,
  );

export const updatePlayerHand = (players: Player[], playerId: string, newHand: Card[]) =>
  players.map((player) =>
    player.id === playerId
      ? { ...player, hand: newHand }
      : player,
  );

export const removeCardFromPlayerHand = (players: Player[], playerId: string, cardId: string) =>
  players.map((player) =>
    player.id === playerId
      ? { ...player, hand: player.hand.filter((card) => card.id !== cardId) }
      : player,
  );

export const removeCardsFromPlayerHand = (
  players: Player[],
  playerId: string,
  cardIds: string[],
) =>
  players.map((player) =>
    player.id === playerId
      ? { ...player, hand: player.hand.filter((card) => !cardIds.includes(card.id)) }
      : player,
  );
