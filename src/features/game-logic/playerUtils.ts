import type { Card, Player, } from '../../shared/types/game';

export const moveCardToEquipment = (players: Player[], playerId: string, card: Card) => {
  let replacedEquipmentCard: Card | null = null;

  const nextPlayers = players.map((player) => {
    if (player.id !== playerId) {
      return player;
    }

    let nextEquipment = [...player.equipment];

    if (card.effectType === 'WEAPON') {
      const currentWeapon = nextEquipment.find((item) => item.effectType === 'WEAPON');

      if (currentWeapon) {
        replacedEquipmentCard = currentWeapon;
        nextEquipment = nextEquipment.filter((item) => item.id !== currentWeapon.id);
      }
    }

    nextEquipment.push(card);

    return {
      ...player,
      equipment: nextEquipment,
    };
  });

  return {
    nextPlayers,
    replacedEquipmentCard,
  };
};

export const getNextAlivePlayerIndex = (players: Player[], currentIndex: number) => {
  for (let offset = 1; offset <= players.length; offset += 1) {
    const nextIndex = (currentIndex + offset) % players.length;

    if (!players[nextIndex].isEliminated) {
      return nextIndex;
    }
  }

  return currentIndex;
};

export const getPreviousAlivePlayerIndex = (players: Player[], currentIndex: number): number => {
  for (let offset = 1; offset <= players.length; offset += 1) {
    const prevIndex = (currentIndex - offset + players.length) % players.length;
    if (!players[prevIndex].isEliminated) {
      return prevIndex;
    }
  }

  return currentIndex;
};