import { addToHand, discardCards, drawCards, takeAllCards } from '../core/cards';
import { addLog } from '../core/log';
import { getAlivePlayers, getPlayer, hasCharacter, updatePlayer } from '../core/players';
import { ROLE_LABELS } from '../data/roles';
import type { GameState } from '../types';
import { checkVictory } from './victory';

const OUTLAW_KILL_REWARD = 3;

/** Карты погибшего забирает Большой Змей, иначе они уходят в сброс. */
function handOverCardsOfDead(state: GameState, deadId: string): GameState {
  const { state: next, cards } = takeAllCards(state, deadId);
  const vultureSam = getAlivePlayers(next).find((player) => hasCharacter(player, 'vulture_sam'));

  if (!vultureSam || cards.length === 0) return discardCards(next, cards);
  return addLog(addToHand(next, vultureSam.id, cards), `${vultureSam.name} (Большой Змей) забирает все карты погибшего.`);
}

/** «Штрафы и награды» (стр. 4). */
function applyPenaltiesAndRewards(state: GameState, deadId: string, killerId: string | undefined): GameState {
  if (!killerId || killerId === deadId) return state;
  const killer = getPlayer(state, killerId);
  const dead = getPlayer(state, deadId);
  if (killer.isEliminated) return state;

  // «Если шериф убивает помощника, шериф обязан сбросить все свои карты с руки и из игры»
  if (killer.role === 'sheriff' && dead.role === 'deputy') {
    const { state: next, cards } = takeAllCards(state, killerId);
    return addLog(discardCards(next, cards), `Шериф ${killer.name} убил своего помощника и сбрасывает все свои карты.`);
  }

  // «Любой игрок, убивший бандита, добирает на руку 3 карты из колоды»
  if (dead.role === 'outlaw') {
    const { state: next } = drawCards(state, killerId, OUTLAW_KILL_REWARD);
    return addLog(next, `${killer.name} получает награду за бандита: ${OUTLAW_KILL_REWARD} карты.`);
  }

  return state;
}

/** Игрок выбывает: раскрывает роль, теряет все карты; затем штрафы, награды и проверка победы. */
export function eliminatePlayer(state: GameState, deadId: string, killerId?: string): GameState {
  const dead = getPlayer(state, deadId);

  let next = updatePlayer(state, deadId, (player) => ({ ...player, hp: 0, isEliminated: true }));
  next = addLog(next, `${dead.name} выбывает из игры. Роль: ${ROLE_LABELS[dead.role]}.`);
  next = handOverCardsOfDead(next, deadId);
  next = applyPenaltiesAndRewards(next, deadId, killerId);

  return checkVictory(next);
}
