import { useState } from 'react';
import { MAX_PLAYERS, MIN_PLAYERS } from '../../game';
import { BangButton } from '../../shared/ui/BangButton';
import { useGameStore } from '../../store/useGameStore';

const PLAYER_COUNTS = Array.from({ length: MAX_PLAYERS - MIN_PLAYERS + 1 }, (_, i) => MIN_PLAYERS + i);

const defaultName = (index: number) => `Игрок ${index + 1}`;

/** Подготовка партии: число игроков (4–7) и их имена в порядке рассадки по часовой стрелке. */
export function GameSetupScreen() {
  const startGame = useGameStore((store) => store.startGame);
  const [names, setNames] = useState<string[]>(() => Array.from({ length: MIN_PLAYERS }, (_, i) => defaultName(i)));

  const setPlayerCount = (count: number) =>
    setNames((current) => Array.from({ length: count }, (_, i) => current[i] ?? defaultName(i)));

  const setName = (index: number, name: string) =>
    setNames((current) => current.map((value, i) => (i === index ? name : value)));

  const start = () => startGame(names.map((name, i) => name.trim() || defaultName(i)));

  return (
    <div className="flex min-h-screen items-center justify-center bg-bang-bg px-6">
      <div className="w-full max-w-xl rounded-[32px] border-2 border-bang-plate/70 bg-[#f7ead7] px-10 py-10 shadow-2xl">
        <h1 className="text-center font-title text-6xl text-bang-red">Новая партия</h1>
        <p className="mt-2 text-center font-body text-bang-brown/80">
          Игра на одном устройстве: передавайте экран тому, чей сейчас ход.
        </p>

        <p className="mt-8 font-body text-sm uppercase tracking-[0.2em] text-bang-brown/70">Число игроков</p>
        <div className="mt-2 flex gap-2">
          {PLAYER_COUNTS.map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setPlayerCount(count)}
              className={`flex-1 rounded-full py-2 font-title text-2xl transition ${
                names.length === count ? 'bg-bang-red text-white' : 'bg-bang-plate text-bang-brown hover:text-bang-red'
              }`}
            >
              {count}
            </button>
          ))}
        </div>

        <p className="mt-6 font-body text-sm uppercase tracking-[0.2em] text-bang-brown/70">
          Имена (по часовой стрелке)
        </p>
        <div className="mt-2 space-y-2">
          {names.map((name, index) => (
            <input
              key={index}
              value={name}
              maxLength={20}
              onChange={(event) => setName(index, event.target.value)}
              className="w-full rounded-xl border border-bang-plate bg-white px-4 py-2 font-body text-lg text-bang-brown outline-none focus:border-bang-red"
              aria-label={`Имя игрока ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <BangButton to="/" variant="link" className="whitespace-nowrap">
            На главную
          </BangButton>
          <BangButton className="whitespace-nowrap !px-10 !text-[32px]" onClick={start}>
            Раздать карты
          </BangButton>
        </div>
      </div>
    </div>
  );
}
