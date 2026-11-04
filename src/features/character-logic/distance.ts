import type { Player } from '../../shared/types/game';
import { hasCharacter } from './ids';

export const applyCharacterDistanceModifiers = (
  source: Player,
  target: Player,
  distance: number,
) => {
  let nextDistance = distance;

  if (hasCharacter(target, 'paul_regret')) {
    nextDistance += 1;
  }

  if (hasCharacter(source, 'rose_doolan')) {
    nextDistance = Math.max(1, nextDistance - 1);
  }

  return nextDistance;
};
