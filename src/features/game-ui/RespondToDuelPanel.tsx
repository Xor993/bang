import { AcceptActionPanel } from './GameActionPanel';

type Props = {
  onAcceptDamage: () => void;
};

export function RespondToDuelPanel({ onAcceptDamage }: Props) {
  return <AcceptActionPanel onAccept={onAcceptDamage} />;
}
