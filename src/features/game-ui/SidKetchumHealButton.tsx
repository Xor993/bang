import type { Player } from '../../shared/types/game';
import { ActionDockButtons, DockButton } from './ActionDock';

type Props = {
  activePlayer: Player;
  onHeal: () => void;
};

export function SidKetchumHealButton({ activePlayer, onHeal }: Props) {
  const canHeal =
    activePlayer.characterId === 'sid_ketchum' &&
    activePlayer.currentHp < activePlayer.maxHp &&
    activePlayer.hand.length >= 2;

  if (!canHeal) return null;

  return (
    <ActionDockButtons>
      <DockButton onClick={onHeal}>Том: сбросить 2 и лечиться</DockButton>
    </ActionDockButtons>
  );
}
