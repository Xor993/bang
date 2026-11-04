import type { GameState } from "../../shared/types/game";

export const applySaloonEffect = (state: GameState): Partial<GameState> => {
    const alivePlayers = state.players.filter(p => !p.isEliminated);
    if (!alivePlayers.length) return {};

    const updatedPlayers = state.players.map(player => {
        if (!player.isEliminated) {
            const newHp = Math.min(player.currentHp + 1, player.maxHp);
            return { ...player, currentHp: newHp };
        }
        return player;
    })

    return { players: updatedPlayers };
}