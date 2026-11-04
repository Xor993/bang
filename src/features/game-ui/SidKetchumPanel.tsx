import { useState } from 'react';
import type { Player } from '../../shared/types/game';
import { Card as GameCard } from '../../entities/card/Card';
import { DOCK_CARD_CLASS, PlayerPanelHeader } from './GameActionPanel';
import { ActionDockPanel, DockButton } from './ActionDock';

type Props = {
  visiblePlayer: Player;
  onConfirm: (cardIds: string[]) => void;
};

export function SidKetchumPanel({ visiblePlayer, onConfirm }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleCard = (cardId: string) => {
    setSelectedIds((current) => {
      if (current.includes(cardId)) return current.filter((id) => id !== cardId);
      if (current.length >= 2) return current;
      return [...current, cardId];
    });
  };

  return (
    <ActionDockPanel>
      <PlayerPanelHeader
        visiblePlayer={visiblePlayer}
        description="Выберите 2 карты с руки, чтобы восстановить 1 жизнь."
      />

      <div className="mt-3 flex max-w-full flex-wrap justify-end gap-2">
        {visiblePlayer.hand.map((card) => {
          const selected = selectedIds.includes(card.id);
          return (
            <div key={card.id} className={selected ? 'rounded-xl ring-4 ring-amber-300' : ''}>
              <GameCard
                card={card}
                compact
                className={DOCK_CARD_CLASS}
                onClick={() => toggleCard(card.id)}
              />
            </div>
          );
        })}
      </div>

      <DockButton className="mt-4" disabled={selectedIds.length !== 2} onClick={() => onConfirm(selectedIds)}>
        Вылечиться
      </DockButton>
    </ActionDockPanel>
  );
}
