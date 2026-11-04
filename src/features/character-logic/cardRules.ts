import type { Card, GameState, Player } from '../../shared/types/game';
import { hasCharacter } from './ids';

export const canPlayAnotherBang = (player: Player, state: GameState) => {
  const weapon = player.equipment.find((equipmentCard) => equipmentCard.effectType === 'WEAPON');
  const isVolcanic = weapon?.range === 1;

  return isVolcanic || hasCharacter(player, 'willy_the_kid') || state.bangsPlayedThisTurn === 0;
};

export const canUseCardAsMissed = (card: Card, player: Player) =>
  card.effectType === 'MISSED' || (hasCharacter(player, 'calamity_janet') && card.effectType === 'BANG');

export const canUseCardAsBang = (card: Card, player: Player) =>
  card.effectType === 'BANG' || (hasCharacter(player, 'calamity_janet') && card.effectType === 'MISSED');
