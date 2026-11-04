/** Публичный API игрового движка — всё, что нужно интерфейсу. */
export type * from './types';

export { createGame } from './setup';
export { gameReducer } from './engine';

export { CARD_DEFINITIONS, formatCardFace, getSuitSymbol, isRedSuit, isWeapon } from './data/cards';
export { CHARACTERS, getCharacter, getCharacterArtSrc } from './data/characters';
export type { Character } from './data/characters';
export {
  HIDDEN_ROLE_DESCRIPTION,
  MAX_PLAYERS,
  MIN_PLAYERS,
  ROLE_GOALS,
  ROLE_LABELS,
  WINNER_LABELS,
} from './data/roles';

export { getTopOfDiscard } from './core/cards';
export { getPlayer, getWeapon, isInJail } from './core/players';
export { getDistance, getWeaponRange } from './rules/distance';
export {
  canPlayCard,
  canUseDefense,
  canUseSidKetchum,
  getActorId,
  getExcessCardCount,
  getValidTargets,
  needsTarget,
} from './rules/playability';
export { doesDynamiteExplode, isCheckPassed } from './mechanics/checks';
export { getJesseJonesVictims } from './mechanics/drawPhase';
