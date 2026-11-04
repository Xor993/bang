import type { GamePhase } from '../../shared/types/game';
import { ActionDockButtons, DockButton } from './ActionDock';

type Props = {
  phase: GamePhase;
  onEndTurn: () => void;
};

export function EndTurnPanel({ phase, onEndTurn }: Props) {
  return (
    <ActionDockButtons>
      <DockButton onClick={onEndTurn}>
        {phase === 'DISCARD_EXCESS' ? 'Сбросить лишние карты' : 'Передать ход'}
      </DockButton>
    </ActionDockButtons>
  );
}
