import type { CSSProperties } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getValidTargets } from '../../features/game-logic/cardRules';
import type { Player } from '../../shared/types/game';
import { PlayerBoard } from './PlayerBoard';

interface Props {
  player: Player;
  positionClass: string;
  positionStyle?: CSSProperties;
  isActiveSeat: boolean;
  compact?: boolean;
}

export function PlayerStation({ player, positionClass, positionStyle, isActiveSeat, compact }: Props) {
  const state = useGameStore();
  const { activePlayerId, targetingCardId, playCard } = state;

  const me = state.players.find((p) => p.id === activePlayerId);
  const targetingCard = me?.hand.find((c) => c.id === targetingCardId);

  const isValidTarget = targetingCard
    ? getValidTargets(targetingCard, me!, state).includes(player.id)
    : false;

  const handleClick = () => {
    if (targetingCardId && player.id !== activePlayerId && isValidTarget) {
      playCard(targetingCardId, player.id);
    }
  };

  return (
    <div className={`absolute flex flex-col items-center ${positionClass}`} style={positionStyle}>
      <PlayerBoard
        player={player}
        isActivePlayer={isActiveSeat}
        isValidTarget={isValidTarget}
        compact={compact}
        onClick={targetingCardId && player.id !== activePlayerId && isValidTarget ? handleClick : undefined}
      />
    </div>
  );
}
