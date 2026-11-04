/**
 * Постоянные (синие) карты (стр. 3, 5): кладутся лицом вверх перед собой и действуют, пока лежат в игре.
 * «Тюрьма» кладётся перед выбранным игроком. Оружие может быть только одно: новое заменяет старое.
 * Сами эффекты синих карт работают в других местах:
 * «Мустанг», «Прицел», оружие → rules/distance.ts; «Волканик» → rules/characterRules.ts;
 * «Бочка» → cards/shooting.ts; «Тюрьма», «Динамит» → mechanics/turn.ts.
 */
import { addToPlay, discardCards, removeFromPlay } from '../core/cards';
import { addLog } from '../core/log';
import { getPlayer, getWeapon } from '../core/players';
import { isWeapon } from '../data/cards';
import type { Card, GameState } from '../types';

export function placeBlueCard(state: GameState, playerId: string, card: Card, targetId?: string): GameState {
  if (card.kind === 'JAIL' && targetId) return addToPlay(state, targetId, card);

  const currentWeapon = isWeapon(card) ? getWeapon(getPlayer(state, playerId)) : undefined;
  if (!currentWeapon) return addToPlay(state, playerId, card);

  const removed = removeFromPlay(state, playerId, currentWeapon.id);
  const next = addLog(discardCards(removed.state, [removed.card]), `«${currentWeapon.name}» уходит в сброс.`);
  return addToPlay(next, playerId, card);
}
