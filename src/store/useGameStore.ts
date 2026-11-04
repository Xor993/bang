import { create } from 'zustand';
import { createGame, gameReducer, getActorId } from '../game';
import type { GameAction, GameState } from '../game';

/**
 * Хранилище экрана игры. Все правила — в движке (src/game), здесь только:
 * - текущее состояние партии;
 * - кто сейчас сидит за экраном (игра «hot seat» на одном устройстве);
 * - карта, для которой игрок выбирает цель.
 */
interface GameStore {
  game: GameState | null;
  /** Игрок, подтвердивший, что сейчас за экраном. Пока это не тот, чьё решение нужно, руки скрыты. */
  seatedPlayerId: string | null;
  targetingCardId: string | null;

  startGame: (playerNames: string[]) => void;
  leaveGame: () => void;
  dispatch: (action: GameAction) => void;
  takeSeat: () => void;
  setTargeting: (cardId: string | null) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  game: null,
  seatedPlayerId: null,
  targetingCardId: null,

  startGame: (playerNames) => set({ game: createGame(playerNames), seatedPlayerId: null, targetingCardId: null }),

  leaveGame: () => set({ game: null, seatedPlayerId: null, targetingCardId: null }),

  dispatch: (action) =>
    set((store) => (store.game ? { game: gameReducer(store.game, action), targetingCardId: null } : store)),

  takeSeat: () => set((store) => (store.game ? { seatedPlayerId: getActorId(store.game) } : store)),

  setTargeting: (cardId) => set({ targetingCardId: cardId }),
}));

/** Партия для компонентов, которые показываются только во время игры. */
export const useGame = (): GameState => {
  const game = useGameStore((store) => store.game);
  if (!game) throw new Error('useGame вызван вне партии');
  return game;
};

/** Игрок, чьё решение ждёт игра. */
export const useActorId = () => getActorId(useGame());
