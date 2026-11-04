import type { CharacterId, Player } from '../../shared/types/game';

export const hasCharacter = (player: Player | undefined | null, characterId: CharacterId) =>
  player?.characterId === characterId;

export const findPlayer = (players: Player[], playerId: string | undefined) =>
  playerId ? players.find((player) => player.id === playerId) : undefined;
