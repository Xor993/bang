import type { GameState, Player } from "../../shared/types/game";
import { drawCardsForPlayer } from "../game-logic/draw";

export const applyStagecoachEffect = (state: GameState, player: Player): Partial<GameState> => {
    const drawResult = drawCardsForPlayer(state.players, player.id, 2, state.deck, state.discard);

    return {
        players: drawResult.players,
        deck: drawResult.deck,
        discard: drawResult.discard,
    };
};