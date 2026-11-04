import type { Card, Player } from '../../shared/types/game';
import { CardChoicePanel } from './GameActionPanel';

type Props = {
  visiblePlayer: Player;
  cards: Card[];
  onChoose: (cardId: string) => void;
};

export function LuckyDukeCheckPanel({ visiblePlayer, cards, onChoose }: Props) {
  return (
    <CardChoicePanel
      visiblePlayer={visiblePlayer}
      description="Выберите карту для проверки."
      cards={cards}
      onSelect={onChoose}
    />
  );
}
