import type { EffectType } from './types/game';

export const EFFECT_CARD_ART: Partial<Record<EffectType, string>> = {
};

export const getCardArtSrc = (effectType: EffectType) => EFFECT_CARD_ART[effectType];

export const getEffectGlyphEmoji = (effectType: EffectType): string => {
  switch (effectType) {
    case 'BANG':
      return '🔫';
    case 'MISSED':
      return '🛡️';
    case 'BEER':
      return '🍺';
    case 'WEAPON':
      return '🔫';
    case 'BARREL':
      return '🛢';
    case 'MUSTANG':
      return '🐎';
    case 'SCOPE':
      return '🎯';
    case 'JAIL':
      return '⛓';
    case 'DYNAMITE':
      return '🧨';
    case 'GATLING':
      return '💥';
    case 'INDIANS':
      return '🏹';
    case 'DUEL':
      return '⚔️';
    case 'PANIC':
      return '😱';
    case 'CAT_BALOU':
      return '💋';
    case 'STAGECOACH':
      return '🚌';
    case 'WELLS_FARGO':
      return '🏦';
    case 'GENERAL_STORE':
      return '🏪';
    case 'SALOON':
      return '🍻';
    default:
      return '🃏';
  }
};
