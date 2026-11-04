import type { Card, Player, PendingAction } from '../../shared/types/game';
import { drawCardsForPlayer } from './draw';
import { filterAliveTargets } from './playerFiltering';

export interface CreateNextPendingActionParams {
  currentAction: PendingAction;
  players: Player[];
  hasMoreItems: boolean;
}

export const createNextPendingAction = ({
  currentAction,
  players,
  hasMoreItems,
}: CreateNextPendingActionParams): PendingAction | null => {
  if (!hasMoreItems) return null;

  const queueTargets = currentAction.queueTargetIds ?? [];
  const aliveQueue = filterAliveTargets(queueTargets, players);

  if (aliveQueue.length === 0) return null;

  return {
    ...currentAction,
    targetId: aliveQueue[0],
    queueTargetIds: aliveQueue.slice(1),
    ...(currentAction.type === 'RESPOND_TO_BANG'
      ? { barrelCheckUsed: false, jourdonnaisCheckUsed: false, missedPlayed: 0, checkCards: undefined }
      : {}),
  };
};

export const awardKiller = (
  players: Player[],
  killedPlayerId: string,
  killerId: string | undefined,
  deck: Card[],
  discard: Card[],
) => {
  if (!killerId) {
    return {
      players,
      deck,
      discard,
    };
  }

  const killer = players.find((p) => p.id === killerId && !p.isEliminated);
  const killed = players.find((p) => p.id === killedPlayerId);

  if (!killer || !killed || !killed.isEliminated || killed.role !== 'outlaw') {
    return {
      players,
      deck,
      discard,
    };
  }

  return drawCardsForPlayer(players, killer.id, 3, deck, discard);
};
