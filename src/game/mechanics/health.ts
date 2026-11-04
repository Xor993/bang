/**
 * Здоровье: потеря и восстановление, спасение от гибели «Отдыхом»,
 * свойства Бутча Кэссиди, Джанго и Тома Кетчума.
 */
import { addToHand, discardFromHand, drawCards, removeRandomFromHand } from '../core/cards';
import { addLog } from '../core/log';
import { doesBeerWork, getAlivePlayers, getPlayer, hasCharacter, updatePlayer } from '../core/players';
import type { GameState, Player } from '../types';
import { eliminatePlayer } from './elimination';

// ─── Восстановление ─────────────────────────────────────────────────────────

/** «Вы не можете получить больше единиц здоровья, чем у вас было в начале партии». */
export const heal = (state: GameState, playerId: string, amount = 1): GameState =>
  updatePlayer(state, playerId, (player) => ({ ...player, hp: Math.min(player.maxHp, player.hp + amount) }));

export const healAllAlive = (state: GameState): GameState =>
  getAlivePlayers(state).reduce((next, player) => heal(next, player.id), state);

// ─── Потеря здоровья ────────────────────────────────────────────────────────

/** Свойства, срабатывающие на каждую потерянную единицу здоровья. */
function onLifeLost(state: GameState, playerId: string, attackerId: string | undefined): GameState {
  const player = getPlayer(state, playerId);
  let next = state;

  // Бутч Кэссиди: «всякий раз, когда теряет единицу здоровья, немедленно тянет карту из колоды»
  if (hasCharacter(player, 'bart_cassidy')) {
    next = addLog(drawCards(next, playerId, 1).state, `${player.name} (Бутч Кэссиди) тянет карту за потерянное здоровье.`);
  }

  // Джанго: за урон от карты соперника вслепую тянет карту с его руки. За «Динамит» никто не отвечает.
  if (hasCharacter(player, 'el_gringo') && attackerId && attackerId !== playerId) {
    const attacker = getPlayer(next, attackerId);
    const stolen = removeRandomFromHand(next, attackerId);
    if (stolen.card && !attacker.isEliminated) {
      next = addToHand(stolen.state, playerId, [stolen.card]);
      next = addLog(next, `${player.name} (Джанго) вытягивает карту с руки у ${attacker.name}.`);
    }
  }

  return next;
}

/**
 * Сколько здоровья игрок может срочно восстановить: «Отдых» (если в игре больше двух игроков)
 * и сброс пар карт Томом Кетчумом.
 */
function getEmergencyHealing(state: GameState, player: Player): number {
  const beers = doesBeerWork(state) ? player.hand.filter((card) => card.kind === 'BEER').length : 0;
  if (!hasCharacter(player, 'sid_ketchum')) return beers;
  return beers + Math.floor((player.hand.length - beers) / 2);
}

/**
 * Игрок теряет здоровье. Вызывается, когда текущий запрос уже закрыт.
 * Потеряв последнюю единицу, игрок может спастись «Отдыхом» — тогда открывается запрос DYING.
 */
export function dealDamage(state: GameState, targetId: string, amount: number, attackerId?: string): GameState {
  const target = getPlayer(state, targetId);
  let next = updatePlayer(state, targetId, (player) => ({ ...player, hp: player.hp - amount }));
  next = addLog(next, `${target.name} теряет ${amount} здоровья.`);

  for (let i = 0; i < amount; i += 1) {
    next = onLifeLost(next, targetId, attackerId);
  }

  const wounded = getPlayer(next, targetId);
  if (wounded.hp > 0) return next;

  const healthNeeded = 1 - wounded.hp;
  if (getEmergencyHealing(next, wounded) >= healthNeeded) {
    return { ...next, prompt: { kind: 'DYING', actorId: targetId, attackerId } };
  }

  return eliminatePlayer(next, targetId, attackerId);
}

// ─── Спасение от гибели ─────────────────────────────────────────────────────

/** Если умирающий восстановил здоровье выше нуля — он спасён. */
function resolveDyingIfSaved(state: GameState): GameState {
  const { prompt } = state;
  if (prompt?.kind !== 'DYING' || getPlayer(state, prompt.actorId).hp <= 0) return state;
  return addLog({ ...state, prompt: null }, `${getPlayer(state, prompt.actorId).name} спасается от гибели.`);
}

/** «Отдых», сыгранный при потере последней единицы здоровья (карта уже сброшена). */
export const saveWithBeer = (state: GameState, playerId: string): GameState =>
  resolveDyingIfSaved(heal(state, playerId));

/** Умирающий отказывается спасаться (или больше нечем). */
export function acceptDeath(state: GameState): GameState {
  const { prompt } = state;
  if (prompt?.kind !== 'DYING') return state;
  return eliminatePlayer({ ...state, prompt: null }, prompt.actorId, prompt.attackerId);
}

/** Том Кетчум: «может в любой момент игры сбросить 2 карты с руки, чтобы восстановить единицу здоровья». */
export function healWithSidKetchum(state: GameState, playerId: string, cardIds: [string, string]): GameState {
  const player = getPlayer(state, playerId);
  const [first, second] = cardIds;
  const ownsBoth = first !== second && [first, second].every((id) => player.hand.some((card) => card.id === id));
  if (!ownsBoth) return state;

  let next = discardFromHand(discardFromHand(state, playerId, first), playerId, second);
  next = addLog(heal(next, playerId), `${player.name} (Том Кетчум) сбрасывает 2 карты и восстанавливает здоровье.`);
  return resolveDyingIfSaved(next);
}
