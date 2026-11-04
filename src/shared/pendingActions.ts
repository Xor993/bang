import type { GameState, PendingActionType } from './types/game';

const IMMEDIATE_CHOICE_ACTION_TYPES = new Set<PendingActionType>([
  'CHOOSE_GENERAL_STORE_CARD',
  'CHOOSE_CARD_TO_STEAL',
  'CHOOSE_CARD_TO_DISCARD',
  'CHOOSE_DRAW_SOURCE',
  'RESOLVE_BLACK_JACK_DRAW',
  'CHOOSE_KIT_CARSON_CARD',
  'CHOOSE_SID_KETCHUM_DISCARD',
]);

const STAY_ON_CURRENT_SCREEN_ACTION_TYPES = new Set<PendingActionType>([
  'CHOOSE_GENERAL_STORE_CARD',
  'CHOOSE_CARD_TO_STEAL',
  'CHOOSE_CARD_TO_DISCARD',
  'CHOOSE_SID_KETCHUM_DISCARD',
  'CHOOSE_DRAW_SOURCE',
  'CHOOSE_KIT_CARSON_CARD',
]);

export const getVisiblePlayerId = (state: Pick<GameState, 'activePlayerId' | 'pendingAction'>) =>
  state.pendingAction?.targetId ?? state.activePlayerId;

export const isImmediateChoicePendingAction = (
  pendingAction: GameState['pendingAction'],
) => Boolean(pendingAction?.checkCards?.length) || (pendingAction ? IMMEDIATE_CHOICE_ACTION_TYPES.has(pendingAction.type) : false);

export const shouldStayOnCurrentScreen = (pendingActionType: PendingActionType | undefined) =>
  pendingActionType ? STAY_ON_CURRENT_SCREEN_ACTION_TYPES.has(pendingActionType) : false;
