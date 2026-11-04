import type { Player, GameState } from '../../shared/types/game';
import { applyCharacterDistanceModifiers } from '../character-logic/distance';

function getBaseDistance(players: Player[], sourceId: string, targetId: string): number {
  const alivePlayers = players.filter(p => !p.isEliminated);
  
  const sourceIndex = alivePlayers.findIndex(p => p.id === sourceId);
  const targetIndex = alivePlayers.findIndex(p => p.id === targetId);

  if (sourceIndex === -1 || targetIndex === -1) return 999;

  const totalPlayers = alivePlayers.length;
  
  const diffRight = Math.abs(sourceIndex - targetIndex);
  const diffLeft = totalPlayers - diffRight;

  return Math.min(diffRight, diffLeft);
}

export function calculateDistance(source: Player, target: Player, state: GameState): number {
  let distance = getBaseDistance(state.players, source.id, target.id);

  const targetHasMustang = target.equipment.some(card => card.effectType === 'MUSTANG');
  if (targetHasMustang) {
    distance += 1;
  }

  const sourceHasScope = source.equipment.some(card => card.effectType === 'SCOPE');
  if (sourceHasScope) {
    distance = Math.max(1, distance - 1);
  }

  return applyCharacterDistanceModifiers(source, target, distance);
}

export function getPlayerRange(player: Player): number {
  const weapon = player.equipment.find(card => card.effectType === 'WEAPON');
  return weapon?.range ?? 1;
}