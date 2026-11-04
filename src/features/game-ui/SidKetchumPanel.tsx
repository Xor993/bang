import { useState } from 'react';
import type { Player } from '../../game';
import { Card as GameCard } from '../../entities/card/Card';
import { DOCK_CARD_CLASS, PlayerPanelHeader } from './GameActionPanel';
import { ActionDockPanel, DockButton } from './ActionDock';

type Props = {
  player: Player;
  onConfirm: (cardIds: [string, string]) => void;
  onCancel: () => void;
};

/** Том Кетчум выбирает 2 карты с руки, чтобы восстановить единицу здоровья. */
export function SidKetchumPanel({ player, onConfirm, onCancel }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleCard = (cardId: string) =>
    setSelectedIds((current) => {
      if (current.includes(cardId)) return current.filter((id) => id !== cardId);
      return current.length < 2 ? [...current, cardId] : current;
    });

  return (
    <ActionDockPanel>
      <PlayerPanelHeader visiblePlayer={player} description="Выберите 2 карты с руки, чтобы восстановить 1 здоровье." />

      <div className="mt-3 flex max-w-full flex-wrap justify-end gap-2">
        {player.hand.map((card) => (
          <div key={card.id} className={selectedIds.includes(card.id) ? 'rounded-xl ring-4 ring-amber-300' : ''}>
            <GameCard card={card} compact className={DOCK_CARD_CLASS} onClick={() => toggleCard(card.id)} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <DockButton onClick={onCancel}>Отмена</DockButton>
        <DockButton
          disabled={selectedIds.length !== 2}
          onClick={() => onConfirm([selectedIds[0], selectedIds[1]])}
        >
          Восстановить здоровье
        </DockButton>
      </div>
    </ActionDockPanel>
  );
}
