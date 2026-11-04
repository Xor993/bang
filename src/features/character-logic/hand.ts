import type { Card, Player } from '../../shared/types/game';
import { drawFromState } from '../game-logic/draw';
import { hasCharacter } from './ids';

type SuzyResult = {
  players: Player[];
  deck: Card[];
  discard: Card[];
  drawnCardIds: string[];
};

export const applySuzyLafayette = (
  players: Player[],
  deck: Card[],
  discard: Card[],
  candidatePlayerIds?: string[],
): SuzyResult => {
  let nextPlayers = players;
  let nextDeck = deck;
  let nextDiscard = discard;
  const drawnCardIds: string[] = [];
  const candidates = candidatePlayerIds
    ? nextPlayers.filter((player) => candidatePlayerIds.includes(player.id))
    : nextPlayers;

  for (const player of candidates) {
    const current = nextPlayers.find((p) => p.id === player.id);
    if (!current || current.isEliminated || !hasCharacter(current, 'suzy_lafayette') || current.hand.length > 0) {
      continue;
    }

    const drawResult = drawFromState(nextDeck, nextDiscard);
    nextDeck = drawResult.nextDeck;
    nextDiscard = drawResult.nextDiscard;
    if (!drawResult.drawnCard) continue;

    drawnCardIds.push(drawResult.drawnCard.id);
    nextPlayers = nextPlayers.map((p) =>
      p.id === current.id ? { ...p, hand: [drawResult.drawnCard!, ...p.hand] } : p,
    );
  }

  return { players: nextPlayers, deck: nextDeck, discard: nextDiscard, drawnCardIds };
};
