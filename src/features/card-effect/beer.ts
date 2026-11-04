import type { GameState, Player } from "../../shared/types/game";

export const applyBeerEffect = (state: GameState, player: Player): Partial<GameState> => {
    const alivedPlayers = state.players.filter(p => !p.isEliminated);

    if (alivedPlayers.length <= 2) {
        return { players: state.players };
    }

    const newPlayers = state.players.map(p => {
        if (p.id === player.id) {
            const newHp = Math.min(p.currentHp + 1, p.maxHp);
            return { ...p, currentHp: newHp };
        }
        return p;
    });
    
    return { players: newPlayers };
}; 