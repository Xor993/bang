import type { Card, Player } from '../../shared/types/game';
import { syncInJailWithEquipment } from '../card-effect/jail';

export const selectCardFromHand = (player: Player): Card | undefined => {
  if (player.hand.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * player.hand.length);
  return player.hand[randomIndex];
};

export const selectCardFromEquipment = (
  player: Player,
  equipmentCardId: string,
): Card | undefined => {
  if (player.equipment.length === 0) return undefined;
  return player.equipment.find((card) => card.id === equipmentCardId);
};

export const selectCardFromHandOrEquipment = (
  mode: 'hand' | 'equipment',
  player: Player,
  equipmentCardId?: string,
): Card | undefined => {
  if (mode === 'hand') {
    return selectCardFromHand(player);
  }
  if (mode === 'equipment' && equipmentCardId) {
    return selectCardFromEquipment(player, equipmentCardId);
  }
  return undefined;
};

export const removeCardFromPlayer = (
  players: Player[],
  playerId: string,
  cardId: string,
  isFromHand: boolean,
) =>
  players.map((player) => {
    if (player.id !== playerId) {
      return player;
    }

    if (isFromHand) {
      return { ...player, hand: player.hand.filter((card) => card.id !== cardId) };
    }
    const equipment = player.equipment.filter((card) => card.id !== cardId);
    return syncInJailWithEquipment({ ...player, equipment });
  });
