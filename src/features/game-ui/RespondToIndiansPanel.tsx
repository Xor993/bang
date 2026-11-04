import { AcceptActionPanel } from './GameActionPanel';

type Props = {
  onAcceptDamage: () => void;
};

export function RespondToIndiansPanel({ onAcceptDamage }: Props) {
  return <AcceptActionPanel onAccept={onAcceptDamage} />;
}
