import type { Role, Winner } from '../types';

export const MIN_PLAYERS = 4;
export const MAX_PLAYERS = 7;

/** Роли по числу игроков (стр. 2, «Подготовка»). */
export const ROLES_BY_PLAYER_COUNT: Record<number, Role[]> = {
  4: ['sheriff', 'renegade', 'outlaw', 'outlaw'],
  5: ['sheriff', 'renegade', 'deputy', 'outlaw', 'outlaw'],
  6: ['sheriff', 'renegade', 'deputy', 'outlaw', 'outlaw', 'outlaw'],
  7: ['sheriff', 'renegade', 'deputy', 'deputy', 'outlaw', 'outlaw', 'outlaw'],
};

export const ROLE_LABELS: Record<Role, string> = {
  sheriff: 'Шериф',
  deputy: 'Помощник',
  outlaw: 'Бандит',
  renegade: 'Ренегат',
};

/** Цели ролей (стр. 1, «Цель игры»). */
export const ROLE_GOALS: Record<Role, string> = {
  sheriff: 'Выведите из игры всех бандитов и ренегата. Ваша роль открыта, и вы начинаете с +1 здоровьем.',
  deputy: 'Защищайте шерифа любой ценой: вы побеждаете вместе с ним. Роль скрыта до выбывания.',
  outlaw: 'Избавьтесь от шерифа. Роль скрыта до выбывания.',
  renegade: 'Станьте новым шерифом: останьтесь единственным выжившим. Роль скрыта до выбывания.',
};

export const HIDDEN_ROLE_DESCRIPTION =
  'Роль этого игрока скрыта и откроется, когда он выбудет из игры. Только шериф раскрывает себя с самого начала.';

export const WINNER_LABELS: Record<Winner, string> = {
  LAW: 'Шериф и помощники победили',
  OUTLAWS: 'Бандиты победили',
  RENEGADE: 'Ренегат победил',
};
