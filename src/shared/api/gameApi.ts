import { CHARACTERS } from '../data/characters';
import { getShuffledDeck } from '../data/deck';
import type { Player, Card, Role } from '../types/game';

const OTHER_PLAYER_NAMES = ['Лара', 'Nonsense'];

const shuffleArray = <T,>(items: T[]): T[] => {
  const next = [...items];

  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
};

export const gameApi = {
  createGame: async (playerName: string): Promise<{ players: Player[]; deck: Card[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deck = getShuffledDeck();
        const shuffledChars = shuffleArray(CHARACTERS).slice(0, 3);
        const roles: Role[] = ['sheriff', ...shuffleArray<Role>(['renegade', 'outlaw'])];
        const names = [playerName, ...OTHER_PLAYER_NAMES];

        const players: Player[] = roles.map((role, index) => {
          const character = shuffledChars[index];
          const maxHp = character.hp + (role === 'sheriff' ? 1 : 0);

          return {
            id: String(index + 1),
            name: names[index]!,
            characterId: character.id,
            character: character.name,
            maxHp,
            currentHp: maxHp,
            role,
            hand: deck.splice(0, maxHp),
            equipment: [],
            isEliminated: false,
            isInJail: false,
          };
        });

        resolve({ players, deck });
      }, 1000);
    });
  },
};
