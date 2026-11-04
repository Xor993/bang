import { formatCardFace, isRedSuit } from '../../game';
import { useGame } from '../../store/useGameStore';

type Props = {
  limit?: number;
  variant?: 'dark' | 'light';
};

/** Журнал партии: последние события за столом. */
export function GameLog({ limit = 6, variant = 'dark' }: Props) {
  const entries = useGame().log.slice(-limit);
  const textClass = variant === 'dark' ? 'text-white/85' : 'text-bang-brown';

  return (
    <ul className="space-y-1" aria-label="Журнал партии">
      {entries.map((entry) => (
        <li key={entry.id} className={`flex items-center gap-2 font-body text-xs leading-snug ${textClass}`}>
          {entry.card && (
            <span
              className={`shrink-0 rounded bg-white px-1 font-bold ${isRedSuit(entry.card.suit) ? 'text-red-700' : 'text-neutral-900'}`}
            >
              {formatCardFace(entry.card)}
            </span>
          )}
          <span>{entry.text}</span>
        </li>
      ))}
    </ul>
  );
}
