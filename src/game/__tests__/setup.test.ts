import { describe, expect, it } from 'vitest';
import { createDeck } from '../data/cards';
import { CHARACTERS } from '../data/characters';
import { createGame } from '../setup';

describe('Состав игры', () => {
  it('в колоде 80 карт с уникальными id', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(80);
    expect(new Set(deck.map((card) => card.id)).size).toBe(80);
  });

  it('количество карт каждого типа соответствует базовой колоде', () => {
    const count = (kind: string) => createDeck().filter((card) => card.kind === kind).length;
    expect(count('BANG')).toBe(25);
    expect(count('MISSED')).toBe(12);
    expect(count('BEER')).toBe(6);
    expect(count('JAIL')).toBe(3);
    expect(count('DYNAMITE')).toBe(1);
  });

  it('16 персонажей', () => {
    expect(CHARACTERS).toHaveLength(16);
  });
});

describe('Подготовка (стр. 2)', () => {
  it.each([
    [4, { sheriff: 1, renegade: 1, outlaw: 2, deputy: 0 }],
    [5, { sheriff: 1, renegade: 1, outlaw: 2, deputy: 1 }],
    [6, { sheriff: 1, renegade: 1, outlaw: 3, deputy: 1 }],
    [7, { sheriff: 1, renegade: 1, outlaw: 3, deputy: 2 }],
  ])('роли для %i игроков', (count, expected) => {
    const game = createGame(Array.from({ length: count }, (_, i) => `Игрок ${i + 1}`));
    const roles = game.players.map((player) => player.role);
    for (const [role, amount] of Object.entries(expected)) {
      expect(roles.filter((r) => r === role)).toHaveLength(amount);
    }
  });

  it('шериф получает +1 здоровье и ходит первым; у каждого столько карт, сколько здоровья', () => {
    const game = createGame(['A', 'B', 'C', 'D', 'E']);
    const sheriff = game.players.find((player) => player.role === 'sheriff')!;
    const character = CHARACTERS.find((c) => c.id === sheriff.characterId)!;

    expect(sheriff.maxHp).toBe(character.hp + 1);
    expect(game.activePlayerId).toBe(sheriff.id);
    expect(game.phase).toBe('DRAW');
    for (const player of game.players) expect(player.hand).toHaveLength(player.hp);

    const cardsInGame = game.deck.length + game.players.reduce((sum, player) => sum + player.hand.length, 0);
    expect(cardsInGame).toBe(80);
  });

  it('не создаёт партию на 3 или 8 игроков', () => {
    expect(() => createGame(['A', 'B', 'C'])).toThrow();
    expect(() => createGame(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])).toThrow();
  });
});
