import { checkDynamiteEscape, checkResultFromCard } from '../../../features/game-logic/checkUtils';
import { getPreviousAlivePlayerIndex } from '../../../features/game-logic/playerUtils';
import { advanceTurn } from '../../../features/game-logic/turnUtils';
import { applyDamageWithCharacterAbilities } from '../../../features/character-logic/damage';
import type { GameStore } from '../../types';

export function resolveDynamiteCheck(state: GameStore): Partial<GameStore> | GameStore {
  const action = state.pendingAction;
  if (!action || action.type !== 'CHECK_DYNAMITE') return state;

  const drawnCard = state.lastDrawnCardForCheck;
  if (!drawnCard) return state;

  const owner = state.players.find((p) => p.id === action.targetId);
  if (!owner || owner.isEliminated) return state;

  const dynamiteCard = owner.equipment.find((c) => c.effectType === 'DYNAMITE');
  if (!dynamiteCard) {
    return {
      pendingAction: null,
      lastDrawnCardForCheck: null,
      phase: 'DRAW' as const,
      isTurnTransitionVisible: false,
    };
  }

  const passedSafely = checkDynamiteEscape(checkResultFromCard(drawnCard));
  const ownerIndex = state.players.findIndex((p) => p.id === action.targetId);

  const afterPenaltyCommon = (
    nextPlayers: typeof state.players,
    nextDeck: typeof state.deck,
    nextDiscard: typeof state.discard,
    damageWinner: string | null,
  ) => {
    if (damageWinner) {
      return {
        players: nextPlayers,
        deck: nextDeck,
        discard: nextDiscard,
        pendingAction: null,
        lastDrawnCardForCheck: null,
        winnerMessage: damageWinner,
        isTurnTransitionVisible: true,
        targetingCardId: null,
      };
    }

    const survivor = nextPlayers.find((p) => p.id === action.targetId);
    if (!survivor || survivor.isEliminated) {
      return advanceTurn({
        ...state,
        players: nextPlayers,
        deck: nextDeck,
        discard: nextDiscard,
        pendingAction: null,
        lastDrawnCardForCheck: null,
        winnerMessage: null,
      });
    }

    if (survivor.isInJail) {
      return {
        players: nextPlayers,
        deck: nextDeck,
        discard: nextDiscard,
        phase: 'CHECK_PENALTIES' as const,
        pendingAction: { type: 'CHECK_JAIL' as const, targetId: action.targetId },
        lastDrawnCardForCheck: null,
        isTurnTransitionVisible: false,
        targetingCardId: null,
      };
    }

    return {
      players: nextPlayers,
      deck: nextDeck,
      discard: nextDiscard,
      phase: 'DRAW' as const,
      pendingAction: null,
      lastDrawnCardForCheck: null,
      isTurnTransitionVisible: false,
      targetingCardId: null,
      drawPulseCardIds: null,
    };
  };

  if (!passedSafely) {
    let nextPlayers = state.players.map((p) =>
      p.id === action.targetId
        ? { ...p, equipment: p.equipment.filter((c) => c.effectType !== 'DYNAMITE') }
        : p,
    );
    let nextDiscard = [dynamiteCard, ...state.discard];
    const damageResult = applyDamageWithCharacterAbilities(
      nextPlayers,
      state.deck,
      nextDiscard,
      action.targetId,
      3,
      undefined,
    );
    nextPlayers = damageResult.players;
    const nextDeck = damageResult.deck;
    nextDiscard = damageResult.discard;

    return afterPenaltyCommon(nextPlayers, nextDeck, nextDiscard, damageResult.winnerMessage);
  }

  const leftIndex = getPreviousAlivePlayerIndex(state.players, ownerIndex);
  const leftId = state.players[leftIndex].id;

  const nextPlayers = state.players.map((p) => {
    if (p.id === action.targetId) {
      return { ...p, equipment: p.equipment.filter((c) => c.effectType !== 'DYNAMITE') };
    }
    if (p.id === leftId) {
      return { ...p, equipment: [...p.equipment, dynamiteCard] };
    }
    return p;
  });

  return afterPenaltyCommon(nextPlayers, state.deck, state.discard, null);
}

export function resolveJailCheck(state: GameStore): Partial<GameStore> | GameStore {
  const action = state.pendingAction;
  if (!action || action.type !== 'CHECK_JAIL') return state;

  const prisonPlayer = state.players.find((p) => p.id === action.targetId);
  const drawnCard = state.lastDrawnCardForCheck;

  if (!prisonPlayer || !drawnCard) return state;

  const isEscape = drawnCard.suit === 'hearts';

  const nextPlayers = state.players.map((p) => {
    if (p.id === action.targetId) {
      return {
        ...p,
        isInJail: false,
        equipment: p.equipment.filter((c) => c.effectType !== 'JAIL'),
      };
    }
    return p;
  });

  const jailCard = prisonPlayer.equipment.find((c) => c.effectType === 'JAIL');
  const finalDiscard = jailCard ? [jailCard, ...state.discard] : state.discard;

  if (isEscape) {
    return {
      players: nextPlayers,
      deck: state.deck,
      discard: finalDiscard,
      phase: 'DRAW' as const,
      pendingAction: null,
      targetingCardId: null,
      isTurnTransitionVisible: false,
      lastDrawnCardForCheck: null,
      drawPulseCardIds: null,
    };
  }

  return advanceTurn({
    ...state,
    players: nextPlayers,
    deck: state.deck,
    discard: finalDiscard,
    lastDrawnCardForCheck: null,
  });
}
