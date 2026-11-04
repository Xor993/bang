import { create } from 'zustand';
import { INITIAL_GAME_STATE } from './initialState';
import type { GameStore } from './types';
import { createInitGameActions } from './actions/initGame';
import { createUiActions } from './actions/uiActions';
import { createTurnActions } from './actions/turnActions';
import { createDrawPhaseActions } from './actions/drawPhaseActions';
import { createCheckActions } from './actions/checkActions';
import { createResolvePendingAction } from './actions/resolvePendingAction';
import { createCardChoiceActions } from './actions/cardChoiceActions';
import { createCharacterActions } from './actions/characterActions';
import { createPlayCardAction } from './actions/playCardAction';

export type { GameActions, GameStore } from './types';

export const useGameStore = create<GameStore>((set, get) =>
  ({
    ...INITIAL_GAME_STATE,
    ...createInitGameActions(set, get),
    ...createUiActions(set, get),
    ...createTurnActions(set, get),
    ...createDrawPhaseActions(set, get),
    ...createCheckActions(set, get),
    ...createResolvePendingAction(set, get),
    ...createCardChoiceActions(set, get),
    ...createCharacterActions(set, get),
    ...createPlayCardAction(set, get),
  }) as GameStore,
);
