import type { Player } from '../../game';
import { PlayerStation } from '../../entities/player/PlayerStation';
import { getPlayerStationPlacement } from './gameUiConstants';
import { DeckDrawPile } from './DeckDrawPile';
import { DiscardPile } from './DiscardPile';

type Props = {
  players: Player[];
  activePlayerId: string;
};

export function GameTableArena({ players, activePlayerId }: Props) {
  const activePlayerIndex = players.findIndex((player) => player.id === activePlayerId);

  const positionedPlayers = players.map((player, index) => ({
    player,
    relativeIndex: (index - activePlayerIndex + players.length) % players.length,
  }));

  return (
    <div className="w-[1000px] h-[520px] bg-bang-brown/40 backdrop-blur-sm rounded-[200px] border-[8px] border-bang-plate/30 shadow-2xl flex items-center justify-center relative z-10">
      <div className="z-20 flex gap-12">
        <DeckDrawPile />

        <DiscardPile />
      </div>

      {positionedPlayers.map(({ player, relativeIndex }) => {
        const { className, style } = getPlayerStationPlacement(players.length, relativeIndex);
        const isCompact = players.length > 4;
        return (
          <PlayerStation
            key={player.id}
            player={player}
            positionClass={className}
            positionStyle={style}
            isActiveSeat={relativeIndex === 0}
            compact={isCompact}
          />
        );
      })}
    </div>
  );
}
