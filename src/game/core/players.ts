import { isWeapon } from '../data/cards';
import type { Card, CardKind, CharacterId, GameState, Player } from '../types';

// ─── Поиск ──────────────────────────────────────────────────────────────────

export function getPlayer(state: GameState, playerId: string): Player {
  const player = state.players.find((candidate) => candidate.id === playerId);
  if (!player) throw new Error(`Игрок ${playerId} не найден`);
  return player;
}

export const getActivePlayer = (state: GameState) => getPlayer(state, state.activePlayerId);

export const getAlivePlayers = (state: GameState) => state.players.filter((player) => !player.isEliminated);

export const isAlive = (state: GameState, playerId: string) => !getPlayer(state, playerId).isEliminated;

/** «Отдых» не действует, если в игре остались только двое. */
export const doesBeerWork = (state: GameState) => getAlivePlayers(state).length > 2;

// ─── Порядок за столом ──────────────────────────────────────────────────────
// Игроки хранятся в порядке рассадки, ход передаётся по часовой стрелке —
// то есть к следующему элементу массива («сосед слева»).

/** Живые игроки по часовой стрелке, начиная с указанного (включительно). */
export function getAlivePlayersFrom(state: GameState, startPlayerId: string): Player[] {
  const startIndex = state.players.findIndex((player) => player.id === startPlayerId);
  const ordered = [...state.players.slice(startIndex), ...state.players.slice(0, startIndex)];
  return ordered.filter((player) => !player.isEliminated || player.id === startPlayerId);
}

/** Все остальные живые игроки по часовой стрелке, начиная с соседа слева. */
export const getOtherAlivePlayers = (state: GameState, playerId: string) =>
  getAlivePlayersFrom(state, playerId).filter((player) => player.id !== playerId);

/** Следующий живой игрок по часовой стрелке (сосед слева). */
export function getNextAlivePlayerId(state: GameState, playerId: string): string {
  return getOtherAlivePlayers(state, playerId)[0]?.id ?? playerId;
}

// ─── Свойства игрока ────────────────────────────────────────────────────────

export const hasCharacter = (player: Player, characterId: CharacterId) => player.characterId === characterId;

export const findInPlay = (player: Player, kind: CardKind) => player.inPlay.find((card) => card.kind === kind);

export const hasInPlay = (player: Player, kind: CardKind) => Boolean(findInPlay(player, kind));

export const isInJail = (player: Player) => hasInPlay(player, 'JAIL');

export const getWeapon = (player: Player): Card | undefined => player.inPlay.find(isWeapon);

export const hasAnyCards = (player: Player) => player.hand.length > 0 || player.inPlay.length > 0;

// ─── Изменение ──────────────────────────────────────────────────────────────

export function updatePlayer(state: GameState, playerId: string, update: (player: Player) => Player): GameState {
  return {
    ...state,
    players: state.players.map((player) => (player.id === playerId ? update(player) : player)),
  };
}
