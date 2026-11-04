import type { Role } from '../types/game';
import { ROLE_LABELS } from '../../entities/player/playerBoardUtils';

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  sheriff:
    'Побеждает, если устранены все Бандиты и Ренегат. Получает +1 жизнь. Его роль видна всем с начала игры.',
  deputy:
    'Помогает Шерифу. Побеждает вместе с ним, если все Бандиты и Ренегат устранены. Роль скрыта до смерти.',
  outlaw:
    'Побеждает, если Шериф погиб. Должен стрелять в Шерифа, не раскрывая свою роль. Роль скрыта до смерти.',
  renegade:
    'Побеждает, если остаётся последним живым игроком на столе. Может играть против всех. Роль скрыта до смерти.',
};

export const HIDDEN_ROLE_DESCRIPTION =
  'Роль этого игрока скрыта. Она будет раскрыта, если он выбудет из игры. Шериф — единственный, чья роль видна всем.';

export const getRoleTooltipTitle = (role: Role) => ROLE_LABELS[role];
