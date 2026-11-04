/**
 * Пассивные свойства персонажей, которые меняют правила розыгрыша карт.
 *
 * Где реализованы остальные свойства:
 * - Неуловимый Джо, Хладнокровная Рози   → rules/distance.ts
 * - Бешеный Пёс, Кит Карсон, Джесси Джеймс, Туко → mechanics/drawPhase.ts
 * - Бутч Кэссиди, Джанго                → mechanics/health.ts (onLifeLost)
 * - Большой Змей                        → mechanics/elimination.ts
 * - Счастливчик Люк                     → mechanics/checks.ts
 * - Сюзи Лафайет                        → mechanics/suzyLafayette.ts
 * - Том Кетчум                          → mechanics/health.ts (healWithSidKetchum)
 */
import { getWeapon, hasCharacter } from '../core/players';
import type { Card, Player, ShotPrompt } from '../types';

/** Бедовая Джейн играет «Мимо!» как «Бэнг!». */
export const canUseAsBang = (player: Player, card: Card) =>
  card.kind === 'BANG' || (card.kind === 'MISSED' && hasCharacter(player, 'calamity_janet'));

/** Бедовая Джейн играет «Бэнг!» как «Мимо!». */
export const canUseAsMissed = (player: Player, card: Card) =>
  card.kind === 'MISSED' || (card.kind === 'BANG' && hasCharacter(player, 'calamity_janet'));

/** Ограничение «1 Бэнг! за ход» снимают «Волканик» и Малыш Билли. */
export const hasUnlimitedBangs = (player: Player) =>
  getWeapon(player)?.kind === 'VOLCANIC' || hasCharacter(player, 'willy_the_kid');

/** Ангельские Глазки: попадание его «Бэнг!» отменяют только 2 «Мимо!». «Гатлинг» — не «Бэнг!». */
export const getMissedNeeded = (attacker: Player, cardKind: ShotPrompt['cardKind']) =>
  cardKind === 'BANG' && hasCharacter(attacker, 'slab_the_killer') ? 2 : 1;

/** Счастливчик Люк открывает при проверке 2 карты. */
export const getCheckCardCount = (player: Player) => (hasCharacter(player, 'lucky_duke') ? 2 : 1);

/** Человек-без-Имени — встроенная «Бочка». */
export const hasBuiltInBarrel = (player: Player) => hasCharacter(player, 'jourdonnais');
