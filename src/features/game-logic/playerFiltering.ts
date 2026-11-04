import type { Player } from '../../shared/types/game';

export const filterAlivePlayers = (players: Player[]) =>
  players.filter((player) => !player.isEliminated);

export const filterAliveTargets = (targetIds: string[], players: Player[]) =>
  targetIds.filter((id) => players.some((p) => p.id === id && !p.isEliminated));

export const getAlivePlayerIds = (players: Player[]) =>
  filterAlivePlayers(players).map((p) => p.id);
