import type { GameState, Player } from "../../shared/types/game";
import { drawCardsForPlayer } from "../game-logic/draw";

export const applyWellsFargoEffect =  (state: GameState, player: Player): Partial<GameState> => {
    const drawResult = drawCardsForPlayer(state.players, player.id, 3, state.deck, state.discard);

    return {
        players: drawResult.players,
        deck: drawResult.deck,
        discard: drawResult.discard,
    };
};