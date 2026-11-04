/**
 * Игровой движок: gameReducer(состояние, действие) → новое состояние.
 *
 * Каждое действие совершает «текущий игрок» (getActorId): тот, к кому обращён запрос (prompt),
 * а если запроса нет — активный игрок. Недопустимое действие возвращает состояние без изменений.
 *
 * После каждого действия партия «досчитывается» (settle): срабатывает Сюзи Лафайет,
 * открывается следующий запрос из очереди, а если активный игрок выбыл — ход передаётся дальше.
 */
import { discardCards } from './core/cards';
import { getActivePlayer, getPlayer } from './core/players';
import { defendWithCheck, applyDefenseCheck, takeShot } from './cards/shooting';
import { takeIndiansHit } from './cards/indians';
import { loseDuel } from './cards/duel';
import { pickGeneralStoreCard } from './cards/generalStore';
import { pickOpponentCard } from './cards/panicAndCatBalou';
import { playCard } from './cards/playCard';
import { takeChosenCheckCard } from './mechanics/checks';
import { chooseDrawSource, drawForTurn, returnKitCarsonCard } from './mechanics/drawPhase';
import { acceptDeath, healWithSidKetchum } from './mechanics/health';
import { applySuzyLafayette } from './mechanics/suzyLafayette';
import { applyTurnStartCheck, checkTurnStart, discardExcessCard, endTurn, finishDiscardIfDone, passTurn } from './mechanics/turn';
import { canUseDefense, canUseSidKetchum, getActorId } from './rules/playability';
import type { GameAction, GameState } from './types';

/** Счастливчик Люк выбрал карту проверки — применяем её результат. */
function resolveCheckChoice(state: GameState, cardId: string): GameState {
  const choice = takeChosenCheckCard(state, cardId);
  if (!choice) return state;
  const { prompt, card } = choice;

  if (prompt.reason === 'DYNAMITE' || prompt.reason === 'JAIL') {
    return applyTurnStartCheck(choice.state, prompt.actorId, prompt.reason, card);
  }
  return applyDefenseCheck(choice.state, prompt.shot!, prompt.reason, card);
}

/** Игрок отказывается защищаться и принимает урон. */
function takeHit(state: GameState): GameState {
  switch (state.prompt?.kind) {
    case 'RESPOND_TO_SHOT':
      return takeShot(state);
    case 'RESPOND_TO_INDIANS':
      return takeIndiansHit(state);
    case 'RESPOND_TO_DUEL':
      return loseDuel(state);
    default:
      return state;
  }
}

function applyAction(state: GameState, action: GameAction): GameState {
  const { prompt, phase } = state;
  const isFreeTurn = !prompt;

  switch (action.type) {
    case 'CHECK_TURN_START':
      return checkTurnStart(state);

    case 'DRAW_CARDS':
      return isFreeTurn && phase === 'DRAW' ? drawForTurn(state) : state;

    case 'CHOOSE_DRAW_SOURCE':
      return prompt?.kind === 'CHOOSE_DRAW_SOURCE' ? chooseDrawSource(state, action.source, action.playerId) : state;

    case 'KIT_CARSON_RETURN':
      return returnKitCarsonCard(state, action.cardId);

    case 'PLAY_CARD':
      return playCard(state, action.cardId, action.targetId);

    case 'USE_DEFENSE':
      return canUseDefense(state, action.source) ? defendWithCheck(state, action.source) : state;

    case 'CHOOSE_CHECK_CARD':
      return resolveCheckChoice(state, action.cardId);

    case 'TAKE_HIT':
      return takeHit(state);

    case 'PICK_GENERAL_STORE_CARD':
      return pickGeneralStoreCard(state, action.cardId);

    case 'PICK_OPPONENT_CARD':
      return pickOpponentCard(state, action.zone, action.cardId);

    case 'SID_KETCHUM_HEAL': {
      const actorId = getActorId(state);
      if (!canUseSidKetchum(state, actorId)) return state;
      return finishDiscardIfDone(healWithSidKetchum(state, actorId, action.cardIds));
    }

    case 'ACCEPT_DEATH':
      return acceptDeath(state);

    case 'END_TURN':
      return isFreeTurn && phase === 'PLAY' ? endTurn(state) : state;

    case 'DISCARD_CARD': {
      const ownsCard = getActivePlayer(state).hand.some((card) => card.id === action.cardId);
      return isFreeTurn && phase === 'DISCARD' && ownsCard ? discardExcessCard(state, action.cardId) : state;
    }
  }
}

/** Доводит партию до момента, когда снова нужно решение игрока. */
function settle(state: GameState): GameState {
  let next = applySuzyLafayette(state);

  for (;;) {
    if (next.winner || next.prompt) return next;

    // Активный игрок выбыл в свой ход (взрыв «Динамита», проигранная «Дуэль») — ход переходит дальше
    if (getActivePlayer(next).isEliminated) {
      next = passTurn({ ...next, queue: [] });
      continue;
    }

    // Следующий ожидающий запрос; выбывших игроков пропускаем
    const [head, ...rest] = next.queue;
    if (head) {
      next = { ...next, queue: rest, prompt: getPlayer(next, head.actorId).isEliminated ? null : head };
      continue;
    }

    // Все разобрали «Магазин»; оставшиеся карты (если кто-то выбыл) — в сброс
    if (next.generalStore.length > 0) {
      next = { ...discardCards(next, next.generalStore), generalStore: [] };
    }

    // Проверки начала хода пройдены — фаза набора
    if (next.phase === 'TURN_START') next = { ...next, phase: 'DRAW' };

    return next;
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (state.winner) return state;
  const next = applyAction(state, action);
  return next === state ? state : settle(next);
}
