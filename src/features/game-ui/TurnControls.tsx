import { canUseSidKetchum, getExcessCardCount, getPlayer } from '../../game';
import { useGame, useGameStore } from '../../store/useGameStore';
import { ActionDockButtons, ActionDockPanel, DockButton } from './ActionDock';

type Props = {
  onOpenSidKetchum: () => void;
};

/** Кнопки хода активного игрока: «Передать ход», сброс лишних карт, свойство Тома Кетчума. */
export function TurnControls({ onOpenSidKetchum }: Props) {
  const game = useGame();
  const dispatch = useGameStore((store) => store.dispatch);
  const active = getPlayer(game, game.activePlayerId);
  const canHeal = canUseSidKetchum(game, active.id);
  const excess = getExcessCardCount(active);

  if (game.prompt || game.winner) return null;

  return (
    <>
      {game.phase === 'DISCARD' && (
        <ActionDockPanel>
          <p className="font-body text-sm uppercase tracking-[0.2em] text-white/60">Конец хода</p>
          <p className="mt-1 font-title text-3xl text-bang-plate">Сбросьте {excess}</p>
          <p className="mt-1 font-body text-sm text-white/80">Карт на руке может остаться не больше, чем здоровья</p>
        </ActionDockPanel>
      )}

      <ActionDockButtons>
        {canHeal && <DockButton onClick={onOpenSidKetchum}>Том Кетчум: сбросить 2 и лечиться</DockButton>}
        {game.phase === 'PLAY' && <DockButton onClick={() => dispatch({ type: 'END_TURN' })}>Передать ход</DockButton>}
      </ActionDockButtons>
    </>
  );
}
