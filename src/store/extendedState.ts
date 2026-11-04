import type { GameState, Card } from "../shared/types/game";

export interface ExtendedState extends GameState {
  isLoading: boolean;
  isTurnTransitionVisible: boolean;
  winnerMessage: string | null;
  lastDrawnCardForCheck: Card | null;
  drawPulseCardIds: string[] | null;
}