import type { ExtendedState } from './extendedState';

export const INITIAL_GAME_STATE: ExtendedState = {
  players: [],
  activePlayerId: '',
  deck: [],
  discard: [],
  phase: 'DRAW',
  pendingAction: null,
  bangsPlayedThisTurn: 0,
  generalStoreCards: [],
  isLoading: false,
  targetingCardId: null,
  isTurnTransitionVisible: true,
  winnerMessage: null,
  lastDrawnCardForCheck: null,
  drawPulseCardIds: null,
};
