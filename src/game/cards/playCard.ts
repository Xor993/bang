/**
 * Розыгрыш карты с руки (стр. 3): разовая карта уходит в сброс и применяет эффект,
 * постоянная (синяя) кладётся в игру. Можно ли сыграть карту — решает rules/playability.ts.
 */
import { discardCards, removeFromHand } from '../core/cards';
import { addLog } from '../core/log';
import { getPlayer } from '../core/players';
import { saveWithBeer } from '../mechanics/health';
import { canUseAsBang } from '../rules/characterRules';
import { canPlayCard, getActorId, getValidTargets, needsTarget } from '../rules/playability';
import type { Card, CardKind, GameState, Player } from '../types';
import { answerDuelWithBang, startDuel } from './duel';
import { placeBlueCard } from './equipment';
import { openGeneralStore } from './generalStore';
import { answerIndiansWithBang, playIndians } from './indians';
import { chooseOpponentCard } from './panicAndCatBalou';
import { answerShotWithMissed, shootBang, shootGatling } from './shooting';
import { drinkBeer, openSaloon, takeStagecoach, takeWellsFargo } from './simpleEffects';

type CardEffect = (state: GameState, playerId: string, targetId: string) => GameState;

/** Эффекты разовых карт, сыгранных в свой ход. «Бэнг!» обрабатывается отдельно — у него лимит за ход. */
const OWN_TURN_EFFECTS: Partial<Record<CardKind, CardEffect>> = {
  GATLING: shootGatling,
  INDIANS: playIndians,
  DUEL: startDuel,
  PANIC: (state, playerId, targetId) => chooseOpponentCard(state, playerId, targetId, 'PANIC'),
  CAT_BALOU: (state, playerId, targetId) => chooseOpponentCard(state, playerId, targetId, 'CAT_BALOU'),
  GENERAL_STORE: openGeneralStore,
  BEER: drinkBeer,
  SALOON: openSaloon,
  STAGECOACH: takeStagecoach,
  WELLS_FARGO: takeWellsFargo,
};

function describePlay(state: GameState, player: Player, card: Card, playedAsBang: boolean, targetId?: string) {
  const asBang = playedAsBang && card.kind !== 'BANG' ? ' как «Бэнг!»' : '';
  const target = targetId ? ` против ${getPlayer(state, targetId).name}` : '';
  return `${player.name} играет «${card.name}»${asBang}${target}.`;
}

function playInOwnTurn(state: GameState, player: Player, card: Card, targetId?: string): GameState {
  if (needsTarget(player, card) && (!targetId || !getValidTargets(state, player.id, card).includes(targetId))) {
    return state;
  }

  // Бедовая Джейн может сыграть «Мимо!» как «Бэнг!» — тогда это «Бэнг!» этого хода
  const playedAsBang = canUseAsBang(player, card);
  let next = removeFromHand(state, player.id, card.id).state;
  next = addLog(next, describePlay(next, player, card, playedAsBang, targetId), card);

  if (card.color === 'blue') return placeBlueCard(next, player.id, card, targetId);

  next = discardCards(next, [card]);
  if (playedAsBang) {
    return shootBang({ ...next, bangsPlayedThisTurn: next.bangsPlayedThisTurn + 1 }, player.id, targetId!);
  }

  const effect = OWN_TURN_EFFECTS[card.kind];
  return effect ? effect(next, player.id, targetId ?? '') : next;
}

/** Карта, сыгранная в ответ на запрос: «Мимо!», «Бэнг!» против «Индейцев» и в «Дуэли», «Отдых» при гибели. */
function playAsResponse(state: GameState, player: Player, card: Card): GameState {
  let next = discardCards(removeFromHand(state, player.id, card.id).state, [card]);
  next = addLog(next, `${player.name} сбрасывает «${card.name}».`, card);

  switch (state.prompt?.kind) {
    case 'RESPOND_TO_SHOT':
      return answerShotWithMissed(next);
    case 'RESPOND_TO_INDIANS':
      return answerIndiansWithBang(next);
    case 'RESPOND_TO_DUEL':
      return answerDuelWithBang(next);
    case 'DYING':
      return saveWithBeer(next, player.id);
    default:
      return state;
  }
}

export function playCard(state: GameState, cardId: string, targetId?: string): GameState {
  const player = getPlayer(state, getActorId(state));
  const card = player.hand.find((candidate) => candidate.id === cardId);
  if (!card || !canPlayCard(state, player.id, card)) return state;

  return state.prompt ? playAsResponse(state, player, card) : playInOwnTurn(state, player, card, targetId);
}
