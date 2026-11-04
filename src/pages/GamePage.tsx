import { useState } from 'react';
import { getActorId, getPlayer } from '../game';
import { Hand } from '../features/controls/Hand';
import {
  ActionDock,
  GameBackLink,
  GameLog,
  GameSetupScreen,
  GameTableArena,
  GameTooltipPanel,
  PassDeviceOverlay,
  PromptPanel,
  SheriffCornerBadge,
  SidKetchumPanel,
  TurnControls,
  WinnerOverlay,
} from '../features/game-ui';
import { useGameStore } from '../store/useGameStore';

export function GamePage() {
  const game = useGameStore((store) => store.game);
  if (!game) return <GameSetupScreen />;
  return <GameTable />;
}

function GameTable() {
  const game = useGameStore((store) => store.game)!;
  const seatedPlayerId = useGameStore((store) => store.seatedPlayerId);
  const dispatch = useGameStore((store) => store.dispatch);
  const [isSidKetchumOpen, setSidKetchumOpen] = useState(false);

  const actorId = getActorId(game);
  // Пока за экраном не тот, чьё решение нужно, руки и кнопки скрыты
  const isSeated = seatedPlayerId === actorId;
  const isPlaying = !game.winner;

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/game-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/20" />
      <SheriffCornerBadge players={game.players} />
      <GameTableArena players={game.players} activePlayerId={game.activePlayerId} />

      <div className="absolute left-8 top-28 z-30 w-80 rounded-2xl bg-black/55 p-3 backdrop-blur-sm">
        <GameLog />
      </div>

      {isPlaying && isSeated && (
        <>
          <ActionDock>
            {isSidKetchumOpen ? (
              <SidKetchumPanel
                player={getPlayer(game, actorId)}
                onCancel={() => setSidKetchumOpen(false)}
                onConfirm={(cardIds) => {
                  dispatch({ type: 'SID_KETCHUM_HEAL', cardIds });
                  setSidKetchumOpen(false);
                }}
              />
            ) : (
              <>
                <PromptPanel />
                <TurnControls onOpenSidKetchum={() => setSidKetchumOpen(true)} />
              </>
            )}
          </ActionDock>
          <Hand />
        </>
      )}

      <GameBackLink />
      {isPlaying && !isSeated && <PassDeviceOverlay />}
      {game.winner && <WinnerOverlay winner={game.winner} />}
      <GameTooltipPanel />
    </div>
  );
}
