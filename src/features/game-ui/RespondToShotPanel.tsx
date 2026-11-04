import { canUseDefense } from '../../game';
import type { GameState } from '../../game';
import { ActionDockButtons, DockButton } from './ActionDock';

type Props = {
  game: GameState;
  onTakeHit: () => void;
  onDefend: (source: 'BARREL' | 'JOURDONNAIS') => void;
};

/** Ответ на «Бэнг!» или «Гатлинг»: «Мимо!» играется с руки, здесь — проверки и потеря здоровья. */
export function RespondToShotPanel({ game, onTakeHit, onDefend }: Props) {
  return (
    <ActionDockButtons>
      <DockButton onClick={onTakeHit}>Потерять здоровье</DockButton>
      {canUseDefense(game, 'BARREL') && <DockButton onClick={() => onDefend('BARREL')}>Проверить «Бочку»</DockButton>}
      {canUseDefense(game, 'JOURDONNAIS') && (
        <DockButton onClick={() => onDefend('JOURDONNAIS')}>Своя бочка</DockButton>
      )}
    </ActionDockButtons>
  );
}
