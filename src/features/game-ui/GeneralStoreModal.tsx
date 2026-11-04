import type { Card, Player } from '../../shared/types/game';
import { CardChoicePanel } from './GameActionPanel';

type Props = {
  visiblePlayer: Player;
  cards: Card[];
  onPick: (cardId: string) => void;
};

export function GeneralStoreModal({ visiblePlayer, cards, onPick }: Props) {
  return (
    <CardChoicePanel
      title={`${visiblePlayer.name}, выберите карту из Магазина`}
      cards={cards}
      onSelect={onPick}
      wrap
    />
  );
}
