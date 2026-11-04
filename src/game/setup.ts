/** «Подготовка» (стр. 2). */
import { addLog } from './core/log';
import { shuffle } from './core/random';
import { createDeck } from './data/cards';
import { CHARACTERS } from './data/characters';
import { MAX_PLAYERS, MIN_PLAYERS, ROLES_BY_PLAYER_COUNT } from './data/roles';
import type { GameState, Player } from './types';

/** «Шериф получает один патрон сверх положенного». */
const SHERIFF_BONUS_HP = 1;

export function createGame(playerNames: string[]): GameState {
  const roles = ROLES_BY_PLAYER_COUNT[playerNames.length];
  if (!roles) throw new Error(`В «Бэнг!» играют от ${MIN_PLAYERS} до ${MAX_PLAYERS} игроков`);

  const shuffledRoles = shuffle(roles);
  const characters = shuffle(CHARACTERS);
  let deck = shuffle(createDeck());

  const players: Player[] = playerNames.map((name, index) => {
    const role = shuffledRoles[index];
    const character = characters[index];
    const maxHp = character.hp + (role === 'sheriff' ? SHERIFF_BONUS_HP : 0);

    // «Сдайте каждому игроку столько карт, сколько патронов у него на планшете»
    const hand = deck.slice(-maxHp);
    deck = deck.slice(0, -maxHp);

    return {
      id: `player-${index + 1}`,
      name,
      characterId: character.id,
      role,
      maxHp,
      hp: maxHp,
      hand,
      inPlay: [],
      isEliminated: false,
    };
  });

  // «Первый ход делает шериф»
  const sheriff = players.find((player) => player.role === 'sheriff')!;

  const state: GameState = {
    players,
    activePlayerId: sheriff.id,
    phase: 'DRAW',
    deck,
    discard: [],
    bangsPlayedThisTurn: 0,
    generalStore: [],
    prompt: null,
    queue: [],
    winner: null,
    log: [],
  };
  return addLog(state, `Партия началась. Шериф — ${sheriff.name}, он ходит первым.`);
}
