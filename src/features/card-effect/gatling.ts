import type {GameState} from '../../shared/types/game';

export const applyGatlingEffect = (state: GameState, sourceId: string): Partial<GameState> => {
    const targets = state.players.filter(p => !p.isEliminated && p.id !== sourceId);
    const source = state.players.find((player) => player.id === sourceId);
    const missedRequired = source?.characterId === 'slab_the_killer' ? 2 : 1;
    if (!targets.length) return {};

    return {
        pendingAction: {
            type: 'RESPOND_TO_BANG',
            sourceId,
            targetId: targets[0].id,
            queueTargetIds: targets.slice(1).map(p => p.id),
            missedRequired,
            missedPlayed: 0,
        }
    };
}