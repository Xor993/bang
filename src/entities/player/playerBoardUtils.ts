import type { Card, Player, Role } from '../../shared/types/game';

const TABLE_EQUIPMENT = new Set<Card['effectType']>(['BARREL', 'MUSTANG', 'SCOPE', 'JAIL', 'DYNAMITE']);

export const ROLE_LABELS: Record<Role, string> = {
  sheriff: 'Шериф',
  deputy: 'Помощник',
  outlaw: 'Бандит',
  renegade: 'Ренегат',
};

export const isRoleRevealed = (player: Pick<Player, 'role' | 'isEliminated'>) =>
  player.role === 'sheriff' || player.isEliminated;

export const getPublicRoleLabel = (player: Pick<Player, 'role' | 'isEliminated'>) =>
  isRoleRevealed(player) ? ROLE_LABELS[player.role] : null;

export const formatHotSeatRoleLine = (player: Pick<Player, 'role' | 'character'>) =>
  `${ROLE_LABELS[player.role]} · ${player.character}`;

export const splitPlayerEquipment = (equipment: Card[]) => {
  const weapon = equipment.find((item) => item.effectType === 'WEAPON') ?? null;
  const tableEquipment = equipment.filter((item) => TABLE_EQUIPMENT.has(item.effectType));
  return { weapon, tableEquipment };
};

export const ROLE_ICONS: Record<Role, string> = {
  sheriff: '★',
  deputy: '◆',
  outlaw: '☠',
  renegade: '⚑',
};

export const EQUIPMENT_ICONS: Partial<Record<Card['effectType'], string>> = {
  BARREL: '🛢',
  MUSTANG: '🐎',
  SCOPE: '🎯',
  JAIL: '⛓',
  DYNAMITE: '🧨',
  WEAPON: '🔫',
};
