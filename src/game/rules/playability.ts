/**
 * Что игрок может сделать прямо сейчас.
 * Этими функциями пользуются и движок (проверка действий), и интерфейс (подсветка карт и целей),
 * поэтому правила розыгрыша описаны ровно в одном месте.
 */
import {
  doesBeerWork,
  getOtherAlivePlayers,
  getPlayer,
  hasAnyCards,
  hasCharacter,
  hasInPlay,
  isInJail,
} from '../core/players';
import type { Card, GameState, Player } from '../types';
import { canUseAsBang, canUseAsMissed, hasBuiltInBarrel, hasUnlimitedBangs } from './characterRules';
import { getDistance, isInWeaponRange } from './distance';

/** Чьё решение ждёт игра: того, к кому обращён запрос, иначе — активного игрока. */
export const getActorId = (state: GameState) => state.prompt?.actorId ?? state.activePlayerId;

/** Активный игрок в фазе розыгрыша, и никто не должен отвечать на карту. */
const isFreeToPlay = (state: GameState, playerId: string) =>
  !state.winner && !state.prompt && state.phase === 'PLAY' && state.activePlayerId === playerId;

// ─── Цели ───────────────────────────────────────────────────────────────────

/** Карты, которые разыгрываются против выбранного соперника. */
export const needsTarget = (player: Player, card: Card) =>
  canUseAsBang(player, card) || ['PANIC', 'CAT_BALOU', 'DUEL', 'JAIL'].includes(card.kind);

export function getValidTargets(state: GameState, playerId: string, card: Card): string[] {
  const player = getPlayer(state, playerId);
  const opponents = getOtherAlivePlayers(state, playerId);

  const isValid = (target: Player): boolean => {
    if (canUseAsBang(player, card)) return isInWeaponRange(state, playerId, target.id);

    switch (card.kind) {
      case 'PANIC': // «на расстоянии 1»: учитываются «Мустанг» и «Прицел», но не оружие
        return getDistance(state, playerId, target.id) <= 1 && hasAnyCards(target);
      case 'CAT_BALOU': // любой игрок, независимо от расстояния
        return hasAnyCards(target);
      case 'DUEL':
        return true;
      case 'JAIL': // «"Тюрьму" нельзя сыграть на шерифа»
        return target.role !== 'sheriff' && !isInJail(target);
      default:
        return false;
    }
  };

  return opponents.filter(isValid).map((target) => target.id);
}

// ─── Розыгрыш карт ──────────────────────────────────────────────────────────

/** «В ход можно сыграть только одну карту "Бэнг!"» */
export const canPlayAnotherBang = (state: GameState, player: Player) =>
  hasUnlimitedBangs(player) || state.bangsPlayedThisTurn === 0;

/** «У вас в игре не может быть двух одинаковых карт». Оружие при этом заменяется, а не дублируется. */
const hasSameCardInPlay = (player: Player, card: Card) => player.inPlay.some((owned) => owned.kind === card.kind);

/** Карта, сыгранная в свой ход в фазе розыгрыша. */
function canPlayInOwnTurn(state: GameState, player: Player, card: Card): boolean {
  if (canUseAsBang(player, card)) {
    return canPlayAnotherBang(state, player) && getValidTargets(state, player.id, card).length > 0;
  }

  switch (card.kind) {
    case 'MISSED': // «Мимо!» играется только в ответ на попадание
      return false;
    case 'BEER':
      return doesBeerWork(state) && player.hp < player.maxHp;
    case 'PANIC':
    case 'CAT_BALOU':
    case 'DUEL':
    case 'JAIL':
      return getValidTargets(state, player.id, card).length > 0;
    default:
      // Синие карты кладутся перед собой; другое оружие заменит текущее (mechanics/playCard.ts)
      return card.color === 'blue' ? !hasSameCardInPlay(player, card) : true;
  }
}

/** Можно ли сейчас сыграть карту с руки — в свой ход или в ответ на запрос. */
export function canPlayCard(state: GameState, playerId: string, card: Card): boolean {
  if (state.winner) return false;
  const player = getPlayer(state, playerId);
  if (player.isEliminated || !player.hand.some((owned) => owned.id === card.id)) return false;

  const { prompt } = state;
  if (!prompt) return isFreeToPlay(state, playerId) && canPlayInOwnTurn(state, player, card);
  if (prompt.actorId !== playerId) return false;

  switch (prompt.kind) {
    case 'RESPOND_TO_SHOT':
      return canUseAsMissed(player, card);
    case 'RESPOND_TO_INDIANS':
    case 'RESPOND_TO_DUEL':
      return canUseAsBang(player, card);
    case 'DYING': // «Потеряв последнюю единицу здоровья, вы можете сыграть "Отдых", но не "Салун"»
      return card.kind === 'BEER' && doesBeerWork(state);
    default:
      return false;
  }
}

// ─── Прочие действия ────────────────────────────────────────────────────────

/** Защита от выстрела проверкой: «Бочка» и/или встроенная бочка Человека-без-Имени. */
export function canUseDefense(state: GameState, source: 'BARREL' | 'JOURDONNAIS'): boolean {
  const { prompt } = state;
  if (prompt?.kind !== 'RESPOND_TO_SHOT') return false;
  const target = getPlayer(state, prompt.actorId);

  return source === 'BARREL'
    ? hasInPlay(target, 'BARREL') && !prompt.barrelUsed
    : hasBuiltInBarrel(target) && !prompt.abilityUsed;
}

/** Том Кетчум: «в любой момент» — в свой ход и когда теряет последнее здоровье. */
export function canUseSidKetchum(state: GameState, playerId: string): boolean {
  if (state.winner) return false;
  const player = getPlayer(state, playerId);
  if (!hasCharacter(player, 'sid_ketchum') || player.hand.length < 2 || player.hp >= player.maxHp) return false;

  if (state.prompt) return state.prompt.kind === 'DYING' && state.prompt.actorId === playerId;
  return state.activePlayerId === playerId && (state.phase === 'PLAY' || state.phase === 'DISCARD');
}

/** Сколько карт нужно сбросить в конце хода: предел руки равен текущему здоровью. */
export const getExcessCardCount = (player: Player) => Math.max(0, player.hand.length - player.hp);
