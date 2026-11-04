import type { ExtendedState } from './extendedState';

export interface GameActions {
  initGame: (name: string) => Promise<void>;
  drawCard: (playerId: string) => void;
  endTurn: () => void;
  playCard: (cardId: string, targetId?: string) => void;
  setTargeting: (cardId: string | null) => void;
  acknowledgeTurn: () => void;
  discardCard: (cardId: string) => void;
  resolvePendingAction: () => void;
  chooseGeneralStoreCard: (cardId: string) => void;
  choosePanicSteal: (mode: 'hand' | 'equipment', equipmentCardId?: string) => void;
  chooseCatBalouDiscard: (mode: 'hand' | 'equipment', equipmentCardId?: string) => void;
  checkJail: () => void;
  checkDynamite: () => void;
  drawBarrelCheck: () => void;
  drawJourdonnaisCheck: () => void;
  resolveBarrelCheck: () => void;
  chooseLuckyDukeCheck: (cardId: string) => void;
  drawTwoFromDeck: () => void;
  chooseDrawSource: (source: 'deck' | 'discard' | 'player', sourcePlayerId?: string) => void;
  resolveBlackJackDraw: () => void;
  chooseKitCarsonReturn: (cardId: string) => void;
  startSidKetchumHeal: () => void;
  chooseSidKetchumDiscard: (cardIds: string[]) => void;
}

export type GameStore = ExtendedState & GameActions;

export type SetGameState = (
  partial: GameStore | Partial<GameStore> | ((state: GameStore) => GameStore | Partial<GameStore>),
) => void;

export type GetGameState = () => GameStore;

export type GameActionSlice = (set: SetGameState, get: GetGameState) => Partial<GameActions>;
