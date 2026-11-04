import type { Card, Player } from "../../shared/types/game";

export const drawCardsForPlayer = (
  players: Player[],
  playerId: string,
  count: number,
  deck: Card[],
  discard: Card[],
) => {
  let nextDeck = [...deck];
  let nextDiscard = [...discard];
  let nextPlayers = [...players];
  const drawnCards: Card[] = [];

  for (let drawIndex = 0; drawIndex < count; drawIndex += 1) {
    const drawResult = drawFromState(nextDeck, nextDiscard);

    nextDeck = drawResult.nextDeck;
    nextDiscard = drawResult.nextDiscard;

    if (!drawResult.drawnCard) {
      continue;
    }

    drawnCards.push(drawResult.drawnCard);

    nextPlayers = nextPlayers.map((player) =>
      player.id === playerId
        ? { ...player, hand: [...player.hand, drawResult.drawnCard!] }
        : player,
    );
  }

  return {
    players: nextPlayers,
    deck: nextDeck,
    discard: nextDiscard,
    drawnCards,
  };
};

export const drawFromState = (deck: Card[], discard: Card[]) => {
  let nextDeck = [...deck];
  let nextDiscard = [...discard];

  if (nextDeck.length === 0 && nextDiscard.length > 0) {
    nextDeck = shuffleCards(nextDiscard);
    nextDiscard = [];
  }

  const drawnCard = nextDeck.pop();

  return {
    drawnCard,
    nextDeck,
    nextDiscard,
  };
};

export const shuffleCards = (cards: Card[]) => {
  const nextDeck = [...cards];

  for (let i = nextDeck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [nextDeck[i], nextDeck[j]] = [nextDeck[j], nextDeck[i]];
  }

  return nextDeck;
};
