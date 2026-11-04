import type { Card, Player } from '../../shared/types/game';
import { applyDamage } from '../game-logic/damageUtils';
import { drawCardsForPlayer, drawFromState } from '../game-logic/draw';
import { addCardToPlayerHand } from '../game-logic/handUtils';
import { removeCardFromPlayer } from '../game-logic/cardSelection';
import { awardKiller } from '../game-logic/actionUtils';
import { hasCharacter } from './ids';

const getActualHpLost = (before: Player | undefined, after: Player | undefined, requestedAmount: number) => {
  if (!before) return requestedAmount;
  if (!after) return Math.min(before.currentHp, requestedAmount);
  return Math.max(0, before.currentHp - after.currentHp);
};

const removeCardsById = (cards: Card[], cardIds: Set<string>) =>
  cards.filter((card) => !cardIds.has(card.id));

export const applyDamageWithCharacterAbilities = (
  players: Player[],
  deck: Card[],
  discard: Card[],
  targetId: string,
  amount: number,
  sourceId?: string,
  options: { awardOutlaw?: boolean } = {},
) => {
  const beforeTarget = players.find((p) => p.id === targetId);
  const eliminatedCards = beforeTarget ? [...beforeTarget.hand, ...beforeTarget.equipment] : [];

  const damageResult = applyDamage(players, discard, targetId, amount, sourceId);
  let nextPlayers = damageResult.players;
  let nextDeck = deck;
  let nextDiscard = damageResult.discard;

  const afterTarget = nextPlayers.find((p) => p.id === targetId);
  const hpLost = getActualHpLost(beforeTarget, afterTarget, amount);
  const targetSurvived = Boolean(afterTarget && !afterTarget.isEliminated);

  if (hpLost > 0 && targetSurvived && hasCharacter(afterTarget, 'bart_cassidy')) {
    const drawResult = drawCardsForPlayer(nextPlayers, targetId, hpLost, nextDeck, nextDiscard);
    nextPlayers = drawResult.players;
    nextDeck = drawResult.deck;
    nextDiscard = drawResult.discard;
  }

  if (
    hpLost > 0 &&
    targetSurvived &&
    sourceId &&
    sourceId !== targetId &&
    hasCharacter(afterTarget, 'el_gringo')
  ) {
    for (let i = 0; i < hpLost; i += 1) {
      const source = nextPlayers.find((p) => p.id === sourceId && !p.isEliminated);
      if (!source?.hand.length) break;

      const randomIndex = Math.floor(Math.random() * source.hand.length);
      const stolenCard = source.hand[randomIndex];
      nextPlayers = removeCardFromPlayer(nextPlayers, source.id, stolenCard.id, true);
      nextPlayers = addCardToPlayerHand(nextPlayers, targetId, stolenCard);
    }
  }

  const targetEliminated = beforeTarget && afterTarget?.isEliminated;
  if (targetEliminated && eliminatedCards.length > 0) {
    const vultureSam = nextPlayers.find((p) => !p.isEliminated && hasCharacter(p, 'vulture_sam'));
    if (vultureSam) {
      const eliminatedCardIds = new Set(eliminatedCards.map((card) => card.id));
      nextDiscard = removeCardsById(nextDiscard, eliminatedCardIds);
      nextPlayers = nextPlayers.map((player) =>
        player.id === vultureSam.id
          ? { ...player, hand: [...player.hand, ...eliminatedCards] }
          : player,
      );
    }
  }

  if (options.awardOutlaw && targetEliminated) {
    const awardResult = awardKiller(nextPlayers, targetId, sourceId, nextDeck, nextDiscard);
    nextPlayers = awardResult.players;
    nextDeck = awardResult.deck;
    nextDiscard = awardResult.discard;
  }

  return {
    players: nextPlayers,
    deck: nextDeck,
    discard: nextDiscard,
    winnerMessage: damageResult.winnerMessage,
  };
};

export const healPlayer = (players: Player[], playerId: string, amount = 1) =>
  players.map((player) =>
    player.id === playerId
      ? { ...player, currentHp: Math.min(player.maxHp, player.currentHp + amount) }
      : player,
  );

export const drawOneForPlayer = (players: Player[], playerId: string, deck: Card[], discard: Card[]) => {
  const drawResult = drawFromState(deck, discard);
  if (!drawResult.drawnCard) {
    return { players, deck: drawResult.nextDeck, discard: drawResult.nextDiscard };
  }

  return {
    players: addCardToPlayerHand(players, playerId, drawResult.drawnCard),
    deck: drawResult.nextDeck,
    discard: drawResult.nextDiscard,
  };
};
