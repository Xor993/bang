import type { CardKind } from '../game';

/** Значок карты, пока нет отдельных иллюстраций. */
const CARD_GLYPHS: Record<CardKind, string> = {
  BANG: '🔫',
  MISSED: '🛡️',
  BEER: '🍺',
  SALOON: '🍻',
  PANIC: '😱',
  CAT_BALOU: '💋',
  STAGECOACH: '🚌',
  WELLS_FARGO: '🏦',
  GATLING: '💥',
  INDIANS: '🏹',
  DUEL: '⚔️',
  GENERAL_STORE: '🏪',
  BARREL: '🛢',
  MUSTANG: '🐎',
  SCOPE: '🎯',
  JAIL: '⛓',
  DYNAMITE: '🧨',
  VOLCANIC: '🔫',
  SCHOFIELD: '🔫',
  REMINGTON: '🔫',
  CARABINE: '🔫',
  WINCHESTER: '🔫',
};

export const getCardGlyph = (kind: CardKind) => CARD_GLYPHS[kind];
