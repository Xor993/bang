import type { Card, Player } from '../../shared/types/game';
import { isRedCard } from '../../shared/cardUtils';
import { drawCardsForPlayer, drawFromState } from '../game-logic/draw';
import { addCardsToPlayerHand, addCardToPlayerHand } from '../game-logic/handUtils';
import { removeCardFromPlayer } from '../game-logic/cardSelection';
import { hasCharacter } from './ids';

export const drawStandardOrBlackJack = (
  players: Player[],
  playerId: string,
  deck: Card[],
  discard: Card[],
) => {
  const player = players.find((p) => p.id === playerId);
  const drawResult = drawCardsForPlayer(players, playerId, 2, deck, discard);
  let nextPlayers = drawResult.players;
  let nextDeck = drawResult.deck;
  let nextDiscard = drawResult.discard;
  const drawnCards = [...drawResult.drawnCards];

  const secondCard = drawnCards[1];
  if (hasCharacter(player, 'black_jack') && secondCard && isRedCard(secondCard)) {
    const bonus = drawCardsForPlayer(nextPlayers, playerId, 1, nextDeck, nextDiscard);
    nextPlayers = bonus.players;
    nextDeck = bonus.deck;
    nextDiscard = bonus.discard;
    drawnCards.push(...bonus.drawnCards);
  }

  return { players: nextPlayers, deck: nextDeck, discard: nextDiscard, drawnCards };
};

export const drawBlackJackInitialCards = (
  players: Player[],
  playerId: string,
  deck: Card[],
  discard: Card[],
) => drawCardsForPlayer(players, playerId, 2, deck, discard);

export const drawBlackJackBonusIfNeeded = (
  players: Player[],
  playerId: string,
  revealedCards: Card[],
  deck: Card[],
  discard: Card[],
) => {
  const secondCard = revealedCards[1];
  if (!secondCard || !isRedCard(secondCard)) {
    return { players, deck, discard, drawnCards: [] as Card[] };
  }

  return drawCardsForPlayer(players, playerId, 1, deck, discard);
};

export const drawPedroRamirez = (
  players: Player[],
  playerId: string,
  source: 'deck' | 'discard',
  deck: Card[],
  discard: Card[],
) => {
  let nextPlayers = players;
  let nextDeck = deck;
  let nextDiscard = discard;
  const drawnCards: Card[] = [];

  if (source === 'discard' && nextDiscard.length > 0) {
    const [topDiscard, ...restDiscard] = nextDiscard;
    nextDiscard = restDiscard;
    nextPlayers = addCardToPlayerHand(nextPlayers, playerId, topDiscard);
    drawnCards.push(topDiscard);
  } else {
    const drawResult = drawCardsForPlayer(nextPlayers, playerId, 1, nextDeck, nextDiscard);
    nextPlayers = drawResult.players;
    nextDeck = drawResult.deck;
    nextDiscard = drawResult.discard;
    drawnCards.push(...drawResult.drawnCards);
  }

  const secondDraw = drawCardsForPlayer(nextPlayers, playerId, 1, nextDeck, nextDiscard);
  return {
    players: secondDraw.players,
    deck: secondDraw.deck,
    discard: secondDraw.discard,
    drawnCards: [...drawnCards, ...secondDraw.drawnCards],
  };
};

export const drawJesseJones = (
  players: Player[],
  playerId: string,
  source: 'deck' | 'player',
  sourcePlayerId: string | undefined,
  deck: Card[],
  discard: Card[],
) => {
  let nextPlayers = players;
  let nextDeck = deck;
  let nextDiscard = discard;
  const drawnCards: Card[] = [];

  if (source === 'player' && sourcePlayerId) {
    const sourcePlayer = nextPlayers.find((p) => p.id === sourcePlayerId && !p.isEliminated);
    if (sourcePlayer?.hand.length) {
      const randomIndex = Math.floor(Math.random() * sourcePlayer.hand.length);
      const stolenCard = sourcePlayer.hand[randomIndex];
      nextPlayers = removeCardFromPlayer(nextPlayers, sourcePlayer.id, stolenCard.id, true);
      nextPlayers = addCardToPlayerHand(nextPlayers, playerId, stolenCard);
      drawnCards.push(stolenCard);
    }
  }

  if (drawnCards.length === 0) {
    const drawResult = drawCardsForPlayer(nextPlayers, playerId, 1, nextDeck, nextDiscard);
    nextPlayers = drawResult.players;
    nextDeck = drawResult.deck;
    nextDiscard = drawResult.discard;
    drawnCards.push(...drawResult.drawnCards);
  }

  const secondDraw = drawCardsForPlayer(nextPlayers, playerId, 1, nextDeck, nextDiscard);
  return {
    players: secondDraw.players,
    deck: secondDraw.deck,
    discard: secondDraw.discard,
    drawnCards: [...drawnCards, ...secondDraw.drawnCards],
  };
};

export const revealKitCarsonCards = (deck: Card[], discard: Card[]) => {
  let nextDeck = deck;
  let nextDiscard = discard;
  const revealedCards: Card[] = [];

  for (let i = 0; i < 3; i += 1) {
    const drawResult = drawFromState(nextDeck, nextDiscard);
    nextDeck = drawResult.nextDeck;
    nextDiscard = drawResult.nextDiscard;
    if (drawResult.drawnCard) {
      revealedCards.push(drawResult.drawnCard);
    }
  }

  return { deck: nextDeck, discard: nextDiscard, revealedCards };
};

export const finishKitCarsonDraw = (
  players: Player[],
  playerId: string,
  deck: Card[],
  returnCard: Card,
  keepCards: Card[],
) => ({
  players: addCardsToPlayerHand(players, playerId, keepCards),
  deck: [...deck, returnCard],
  drawnCards: keepCards,
});
