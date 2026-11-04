import { getAlivePlayers, getPlayer, getWeapon, hasCharacter, hasInPlay } from '../core/players';
import type { GameState, Player } from '../types';

/** Без оружия игрок стреляет из кольта 45-го калибра — дальность 1 (стр. 5). */
export const COLT_RANGE = 1;

/**
 * Число промежутков между игроками по кратчайшей стороне стола.
 * Выбывшие игроки не учитываются (стр. 4, «Расстояние между игроками»).
 */
function getSeatDistance(state: GameState, fromId: string, toId: string): number {
  const alive = getAlivePlayers(state);
  const fromIndex = alive.findIndex((player) => player.id === fromId);
  const toIndex = alive.findIndex((player) => player.id === toId);
  if (fromIndex === -1 || toIndex === -1) return Infinity;

  const clockwise = Math.abs(fromIndex - toIndex);
  return Math.min(clockwise, alive.length - clockwise);
}

/** Насколько дальше цель видна другим: «Мустанг» и Неуловимый Джо (+1 каждый). */
const getDefenceBonus = (target: Player) =>
  (hasInPlay(target, 'MUSTANG') ? 1 : 0) + (hasCharacter(target, 'paul_regret') ? 1 : 0);

/** Насколько ближе стрелок видит других: «Прицел» и Хладнокровная Рози (−1 каждый). */
const getAttackBonus = (source: Player) =>
  (hasInPlay(source, 'SCOPE') ? 1 : 0) + (hasCharacter(source, 'rose_doolan') ? 1 : 0);

/**
 * Расстояние от одного игрока до другого со всеми модификаторами.
 * Модификаторы складываются, и лишь итог ограничивается снизу единицей:
 * «"Прицел" не может сократить расстояние до нуля» (стр. 8).
 */
export function getDistance(state: GameState, fromId: string, toId: string): number {
  const base = getSeatDistance(state, fromId, toId);
  const distance = base + getDefenceBonus(getPlayer(state, toId)) - getAttackBonus(getPlayer(state, fromId));
  return Math.max(1, distance);
}

/** Оружие не меняет расстояние — оно задаёт максимальную дистанцию атаки (стр. 5). */
export const getWeaponRange = (player: Player) => getWeapon(player)?.range ?? COLT_RANGE;

export const isInWeaponRange = (state: GameState, shooterId: string, targetId: string) =>
  getDistance(state, shooterId, targetId) <= getWeaponRange(getPlayer(state, shooterId));
