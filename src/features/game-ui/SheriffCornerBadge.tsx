import type { Player } from '../../shared/types/game';

type Props = {
  players: Player[];
};

export function SheriffCornerBadge({ players }: Props) {
  const sheriff = players.find((p) => p.role === 'sheriff');
  if (!sheriff) return null;

  return (
    <div
      className="absolute top-8 right-8 z-30 flex items-center gap-2 rounded-full border-2 border-bang-plate/70 bg-black/55 px-4 py-2 shadow-lg backdrop-blur-sm"
      role="status"
      aria-label={`Шериф: ${sheriff.name}`}
    >
      <span className="font-title text-2xl leading-none text-amber-300 drop-shadow-md" aria-hidden>
        ★
      </span>
      <div className="flex flex-col items-start leading-tight">
        <span className="font-title text-[10px] uppercase tracking-[0.2em] text-bang-plate/90">Шериф</span>
        <span className="font-title text-sm font-bold uppercase text-white">{sheriff.name}</span>
      </div>
    </div>
  );
}
