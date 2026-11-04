import type { Card, GameState, Player } from '../../shared/types/game';
import { calculateDistance, getPlayerRange } from './distance';
import { canPlayAnotherBang, canUseCardAsBang, canUseCardAsMissed } from '../character-logic/cardRules';

export function getValidTargets(card: Card, player: Player, state: GameState): string[] {
  const aliveEnemies = state.players.filter(p => !p.isEliminated && p.id !== player.id);
  const hasDiscardableCards = (target: Player) => target.hand.length > 0 || target.equipment.length > 0;

  if (canUseCardAsBang(card, player)) {
    const range = getPlayerRange(player);

    if (!canPlayAnotherBang(player, state)) return [];

    return aliveEnemies
      .filter(enemy => calculateDistance(player, enemy, state) <= range)
      .map(e => e.id);
  }

  if (card.effectType === 'PANIC') {
    return aliveEnemies
      .filter(enemy => calculateDistance(player, enemy, state) <= 1 && hasDiscardableCards(enemy))
      .map(e => e.id);
  }

  if (card.effectType === 'CAT_BALOU') {
    return aliveEnemies
      .filter(hasDiscardableCards)
      .map((enemy) => enemy.id);
  }

  // Indians - можно атаковать любого живого игрока
  if (card.effectType === 'INDIANS') {
    return aliveEnemies.map((enemy) => enemy.id);
  }

  if (card.effectType === 'DUEL') {
    return aliveEnemies.map((enemy) => enemy.id);
  }

  if (card.effectType === 'JAIL') {
    return aliveEnemies
      .filter((enemy) => enemy.role !== 'sheriff')
      .filter((enemy) => !enemy.equipment.some((c) => c.effectType === 'JAIL'))
      .map((enemy) => enemy.id);
  }

  return [];
}

export function canPlayCard(card: Card, player: Player, state: GameState): boolean {
  if (player.isEliminated) return false;

  const isMyTurn = state.activePlayerId === player.id;
  const isPending = state.pendingAction !== null;

  if (isPending) {
    const action = state.pendingAction!;
    if (action.targetId === player.id && action.type === 'RESPOND_TO_BANG') {
      return canUseCardAsMissed(card, player);
    }
    // При Indians можно сбросить BANG вместо урона
    if (action.targetId === player.id && action.type === 'RESPOND_TO_INDIANS') {
      return canUseCardAsBang(card, player);
    }
    if (action.targetId === player.id && action.type === 'RESPOND_TO_DUEL') {
      return canUseCardAsBang(card, player);
    }
    return false;
  }

  if (isMyTurn) {
    if (state.phase === 'DISCARD_EXCESS') return false;
    if (state.phase === 'CHECK_PENALTIES') return false;
    if (state.phase === 'DRAW') return false;
    if (card.effectType === 'MISSED' && !canUseCardAsBang(card, player)) return false;
    if (canUseCardAsBang(card, player)) {
      return getValidTargets(card, player, state).length > 0;
    }
    if (
      card.effectType === 'PANIC' ||
      card.effectType === 'CAT_BALOU' ||
      card.effectType === 'INDIANS' ||
      card.effectType === 'DUEL' ||
      card.effectType === 'JAIL'
    ) {
      return getValidTargets(card, player, state).length > 0;
    }
    if (card.color === 'blue') {
      const alreadyHasCard = player.equipment.some(c => c.name === card.name);
      if (alreadyHasCard) return false;
      return true;
    }
    if (card.effectType === 'BEER') {
      return player.currentHp < player.maxHp;
    }
    return true;
  }


  return false;
}
