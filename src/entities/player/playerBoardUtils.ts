import { isWeapon } from '../../game';
import type { Card, Player, Role } from '../../game';

/** Роль видна всем, если это шериф или игрок выбыл (стр. 2, 4). */
export const isRoleRevealed = (player: Pick<Player, 'role' | 'isEliminated'>) =>
  player.role === 'sheriff' || player.isEliminated;

/** Оружие лежит на планшете, остальные синие карты — над ним. */
export const splitInPlayCards = (inPlay: Card[]) => ({
  weapon: inPlay.find(isWeapon) ?? null,
  tableCards: inPlay.filter((card) => !isWeapon(card)),
});

export const ROLE_ICONS: Record<Role, string> = {
  sheriff: '★',
  deputy: '◆',
  outlaw: '☠',
  renegade: '⚑',
};
