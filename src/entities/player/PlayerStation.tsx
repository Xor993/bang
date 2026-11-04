import type { CSSProperties } from 'react';
import { getPlayer, getValidTargets } from '../../game';
import type { Player } from '../../game';
import { useGame, useGameStore } from '../../store/useGameStore';
import { PlayerBoard } from './PlayerBoard';

interface Props {
  player: Player;
  positionClass: string;
  positionStyle?: CSSProperties;
  isActiveSeat: boolean;
  compact?: boolean;
}

/** Место игрока за столом. Когда выбрана карта с целью, подходящие цели подсвечиваются и кликабельны. */
export function PlayerStation({ player, positionClass, positionStyle, isActiveSeat, compact }: Props) {
  const game = useGame();
  const targetingCardId = useGameStore((store) => store.targetingCardId);
  const dispatch = useGameStore((store) => store.dispatch);

  const shooter = getPlayer(game, game.activePlayerId);
  const targetingCard = shooter.hand.find((card) => card.id === targetingCardId);
  const isValidTarget = targetingCard ? getValidTargets(game, shooter.id, targetingCard).includes(player.id) : false;

  const handleClick = isValidTarget
    ? () => dispatch({ type: 'PLAY_CARD', cardId: targetingCardId!, targetId: player.id })
    : undefined;

  return (
    <div className={`absolute flex flex-col items-center ${positionClass}`} style={positionStyle}>
      <PlayerBoard
        player={player}
        isActivePlayer={isActiveSeat}
        isValidTarget={isValidTarget}
        compact={compact}
        onClick={handleClick}
      />
    </div>
  );
}
