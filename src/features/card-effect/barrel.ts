import type { Player } from '../../shared/types/game';

export const playerHasBarrel = (player: Player | undefined): boolean =>
  Boolean(player?.equipment.some((card) => card.effectType === 'BARREL'));
