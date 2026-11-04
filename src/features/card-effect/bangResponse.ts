import type { GameState } from "../../shared/types/game";

/**
 * Эффект сброса BANG как ответа на Indians
 * Игрок сбрасывает BANG, чтобы избежать урона от Indians
 */
export const applyBangResponseEffect = (state: GameState): Partial<GameState> => {
  const action = state.pendingAction;
  
  // Работает только при ответе на Indians
  if (!action || action.type !== 'RESPOND_TO_INDIANS') {
    return {};
  }

  // Переходим к следующему игроку в очереди
  const queue = action.queueTargetIds ?? [];
  const aliveQueue = queue.filter(id => 
    state.players.some(p => p.id === id && !p.isEliminated)
  );

  // Если очередь пуста - завершаем pendingAction
  if (aliveQueue.length === 0) {
    return { pendingAction: null };
  }

  // Переходим к следующему игроку
  return {
    pendingAction: {
      ...action,
      targetId: aliveQueue[0],
      queueTargetIds: aliveQueue.slice(1),
    },
  };
};
