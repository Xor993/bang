/**
 * 1. Набор (стр. 3): «Возьмите на руку две верхние карты из колоды».
 * Персонажи, меняющие набор: Бешеный Пёс, Кит Карсон, Джесси Джеймс, Туко.
 */
import { addToHand, drawCards, putOnTopOfDeck, removeRandomFromHand, takeTopCards, takeTopOfDiscard } from '../core/cards';
import { addLog } from '../core/log';
import { getActivePlayer, getOtherAlivePlayers, getPlayer, hasCharacter } from '../core/players';
import { formatCardFace, isRedSuit } from '../data/cards';
import type { DrawSource, GameState, Player } from '../types';

const STANDARD_DRAW = 2;
const KIT_CARSON_REVEAL = 3;

const finishDrawPhase = (state: GameState): GameState => ({ ...state, phase: 'PLAY', prompt: null });

/** Соперники, у которых Джесси Джеймс может вытянуть карту. */
export const getJesseJonesVictims = (state: GameState, playerId: string) =>
  getOtherAlivePlayers(state, playerId).filter((player) => player.hand.length > 0);

/** Может ли игрок выбрать, откуда взять первую карту. */
function hasDrawSourceChoice(state: GameState, player: Player): boolean {
  if (hasCharacter(player, 'jesse_jones')) return getJesseJonesVictims(state, player.id).length > 0;
  if (hasCharacter(player, 'pedro_ramirez')) return state.discard.length > 0;
  return false;
}

/** Бешеный Пёс показывает вторую карту: черва или бубна — тянет ещё одну (не показывая её). */
function drawAsBlackJack(state: GameState, player: Player): GameState {
  const { state: drawn, cards } = drawCards(state, player.id, STANDARD_DRAW);
  const second = cards[1];
  if (!second) return drawn;

  const isRed = isRedSuit(second.suit);
  const logged = addLog(
    drawn,
    `${player.name} (Бешеный Пёс) показывает вторую карту: ${formatCardFace(second)}${isRed ? ' — тянет ещё одну.' : '.'}`,
    second,
  );
  return isRed ? drawCards(logged, player.id, 1).state : logged;
}

/** Кит Карсон тянет 3 карты; одну из них вернёт на верх колоды. */
function revealForKitCarson(state: GameState, player: Player): GameState {
  const { state: taken, cards } = takeTopCards(state, KIT_CARSON_REVEAL);
  if (cards.length < KIT_CARSON_REVEAL) return finishDrawPhase(addToHand(taken, player.id, cards));
  return { ...taken, prompt: { kind: 'KIT_CARSON_RETURN', actorId: player.id, cards } };
}

/** Активный игрок нажал на колоду. */
export function drawForTurn(state: GameState): GameState {
  const player = getActivePlayer(state);

  if (hasDrawSourceChoice(state, player)) {
    return { ...state, prompt: { kind: 'CHOOSE_DRAW_SOURCE', actorId: player.id } };
  }
  if (hasCharacter(player, 'kit_carson')) return revealForKitCarson(state, player);
  if (hasCharacter(player, 'black_jack')) return finishDrawPhase(drawAsBlackJack(state, player));

  return finishDrawPhase(drawCards(state, player.id, STANDARD_DRAW).state);
}

/** Джесси Джеймс (вслепую с руки соперника) или Туко (с верха сброса) берёт первую карту, вторую — из колоды. */
export function chooseDrawSource(state: GameState, source: DrawSource, victimId?: string): GameState {
  const player = getActivePlayer(state);
  let next = state;

  if (source === 'player' && hasCharacter(player, 'jesse_jones')) {
    const victim = getJesseJonesVictims(state, player.id).find((candidate) => candidate.id === victimId);
    if (!victim) return state;
    const stolen = removeRandomFromHand(next, victim.id);
    next = addLog(addToHand(stolen.state, player.id, [stolen.card!]), `${player.name} вслепую берёт карту с руки у ${victim.name}.`);
  } else if (source === 'discard' && hasCharacter(player, 'pedro_ramirez')) {
    const taken = takeTopOfDiscard(next);
    if (!taken.card) return state;
    next = addLog(addToHand(taken.state, player.id, [taken.card]), `${player.name} берёт «${taken.card.name}» с верха сброса.`, taken.card);
  } else if (source === 'deck') {
    next = drawCards(next, player.id, 1).state;
  } else {
    return state;
  }

  return finishDrawPhase(drawCards(next, player.id, 1).state);
}

/** Кит Карсон оставляет две карты, а третью «возвращает на верх колоды лицом вниз». */
export function returnKitCarsonCard(state: GameState, cardId: string): GameState {
  const { prompt } = state;
  if (prompt?.kind !== 'KIT_CARSON_RETURN') return state;
  const returned = prompt.cards.find((card) => card.id === cardId);
  if (!returned) return state;

  const kept = prompt.cards.filter((card) => card.id !== cardId);
  const next = putOnTopOfDeck(addToHand(state, prompt.actorId, kept), returned);
  return finishDrawPhase(addLog(next, `${getPlayer(next, prompt.actorId).name} возвращает одну карту на верх колоды.`));
}
