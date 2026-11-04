import type { Player } from '../../shared/types/game';
import { Card as GameCard } from '../../entities/card/Card';
import { DOCK_CARD_CLASS } from './GameActionPanel';
import { ActionDockPanel, DockButton } from './ActionDock';

type Props = {
  title: string;
  visiblePlayer: Player;
  handButtonLabel: string;
  onPickHand: () => void;
  onPickEquipment: (equipmentCardId: string) => void;
};

export function OpponentCardPickModal({
  title,
  visiblePlayer,
  handButtonLabel,
  onPickHand,
  onPickEquipment,
}: Props) {
  return (
    <ActionDockPanel>
      <p className="font-body text-sm uppercase tracking-[0.2em] text-white/70">{title}</p>

      {visiblePlayer.hand.length > 0 && (
        <div className="mt-3 flex justify-end">
          <DockButton onClick={onPickHand}>{handButtonLabel}</DockButton>
        </div>
      )}

      {visiblePlayer.equipment.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          {visiblePlayer.equipment.map((card) => (
            <GameCard
              key={card.id}
              card={card}
              compact
              className={DOCK_CARD_CLASS}
              onClick={() => onPickEquipment(card.id)}
            />
          ))}
        </div>
      )}
    </ActionDockPanel>
  );
}
