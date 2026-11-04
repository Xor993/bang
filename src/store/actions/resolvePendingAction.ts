import type { GameActionSlice } from '../types';
import { resolveRespondToBang, resolveRespondToDuel, resolveRespondToIndians } from './resolvers/respondActions';
import { resolveDynamiteCheck, resolveJailCheck } from './resolvers/penaltyChecks';

export const createResolvePendingAction: GameActionSlice = (set) => ({
  resolvePendingAction: () => {
    set((state) => {
      if (!state.pendingAction || state.winnerMessage) return state;

      switch (state.pendingAction.type) {
        case 'RESPOND_TO_BANG':
          return resolveRespondToBang(state);
        case 'RESPOND_TO_INDIANS':
          return resolveRespondToIndians(state);
        case 'RESPOND_TO_DUEL':
          return resolveRespondToDuel(state);
        case 'CHECK_DYNAMITE':
          return resolveDynamiteCheck(state);
        case 'CHECK_JAIL':
          return resolveJailCheck(state);
        default:
          return state;
      }
    });
  },
});
