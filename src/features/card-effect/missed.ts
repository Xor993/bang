import type { GameState } from "../../shared/types/game";

export const applyMissedEffect = (state: GameState): Partial<GameState> => {
    const action = state.pendingAction;
    if (!action || action.type !== 'RESPOND_TO_BANG') return {}

    const missedRequired = action.missedRequired ?? 1;
    const missedPlayed = (action.missedPlayed ?? 0) + 1;

    if (missedPlayed < missedRequired) {
        return {
            pendingAction: {
                ...action,
                missedPlayed,
            },
        };
    }

    const queue = action.queueTargetIds ?? [];
    const aliveQueue = queue.filter(id => state.players.some(p => p.id === id && !p.isEliminated),
    );

    if (!aliveQueue.length) return { pendingAction: null}

    return {
        pendingAction: {
            ...action,
            targetId: aliveQueue[0],
            queueTargetIds: aliveQueue.slice(1),
            barrelCheckUsed: false,
            jourdonnaisCheckUsed: false,
            missedPlayed: 0,
            checkCards: undefined,
        },
    };
};