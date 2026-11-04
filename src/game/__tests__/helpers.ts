import { CARD_DEFINITIONS } from '../data/cards';
import { gameReducer } from '../engine';
import type { Card, CardKind, CharacterId, GameAction, GameState, Player, Rank, Suit } from '../types';

let cardSequence = 0;

const SUITS: Record<string, Suit> = { '♥': 'hearts', '♦': 'diamonds', '♣': 'clubs', '♠': 'spades' };

/** card('BANG', '5♠') — карта с нужной мастью и достоинством. */
export function card(kind: CardKind, face = 'A♦'): Card {
  cardSequence += 1;
  return {
    id: `${kind.toLowerCase()}-t${cardSequence}`,
    kind,
    ...CARD_DEFINITIONS[kind],
    rank: face.slice(0, -1) as Rank,
    suit: SUITS[face.slice(-1)],
  };
}

type PlayerSetup = Partial<Omit<Player, 'id'>> & { characterId?: CharacterId };

/**
 * Игроки сидят в порядке массива (по часовой стрелке): p1, p2, p3…
 * По умолчанию — p1 шериф, остальные бандиты; персонаж без свойств, влияющих на тест.
 */
export function makeGame(players: PlayerSetup[], overrides: Partial<GameState> = {}): GameState {
  return {
    players: players.map((setup, index) => ({
      id: `p${index + 1}`,
      name: `P${index + 1}`,
      characterId: 'kit_carson',
      role: index === 0 ? 'sheriff' : 'outlaw',
      maxHp: 4,
      hp: 4,
      hand: [],
      inPlay: [],
      isEliminated: false,
      ...setup,
    })),
    activePlayerId: 'p1',
    phase: 'PLAY',
    deck: [],
    discard: [],
    bangsPlayedThisTurn: 0,
    generalStore: [],
    prompt: null,
    queue: [],
    winner: null,
    log: [],
    ...overrides,
  };
}

/** Последовательно применяет действия. */
export const run = (state: GameState, ...actions: GameAction[]) => actions.reduce(gameReducer, state);

export const player = (state: GameState, id: string) => state.players.find((candidate) => candidate.id === id)!;

/** Обычный персонаж без особых свойств в бою. */
export const PLAIN: CharacterId = 'kit_carson';
