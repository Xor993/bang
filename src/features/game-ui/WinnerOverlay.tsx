import { getCharacter, ROLE_LABELS, WINNER_LABELS } from '../../game';
import type { Winner } from '../../game';
import { BangButton } from '../../shared/ui/BangButton';
import { useGame, useGameStore } from '../../store/useGameStore';

const WINNING_ROLES: Record<Winner, string[]> = {
  LAW: ['sheriff', 'deputy'],
  OUTLAWS: ['outlaw'],
  RENEGADE: ['renegade'],
};

/** Конец партии: победившая сторона и все раскрытые роли. */
export function WinnerOverlay({ winner }: { winner: Winner }) {
  const { players } = useGame();
  const leaveGame = useGameStore((store) => store.leaveGame);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 px-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[32px] border-2 border-bang-plate/70 bg-[#f7ead7] px-10 py-10 text-center shadow-2xl">
        <p className="font-body text-lg uppercase tracking-[0.2em] text-bang-brown/70">Партия завершена</p>
        <h2 className="mt-4 font-title text-5xl text-bang-red">{WINNER_LABELS[winner]}</h2>

        <ul className="mt-6 space-y-2 text-left font-body text-lg text-bang-brown">
          {players.map((player) => (
            <li
              key={player.id}
              className={`flex justify-between rounded-xl px-4 py-2 ${WINNING_ROLES[winner].includes(player.role) ? 'bg-amber-200/70' : 'bg-white/50'}`}
            >
              <span>
                {player.name} · {getCharacter(player.characterId).name}
              </span>
              <span className="font-bold">{ROLE_LABELS[player.role]}</span>
            </li>
          ))}
        </ul>

        <BangButton className="mt-8 scale-75" onClick={leaveGame}>
          Новая партия
        </BangButton>
      </div>
    </div>
  );
}
