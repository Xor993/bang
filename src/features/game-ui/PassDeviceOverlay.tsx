import { getActorId, getCharacter, getPlayer, ROLE_LABELS } from '../../game';
import { BangButton } from '../../shared/ui/BangButton';
import { useGame, useGameStore } from '../../store/useGameStore';
import { GameLog } from './GameLog';
import { describePrompt } from './promptText';

/**
 * Игра «hot seat» на одном устройстве: прежде чем показать руку, экран передают тому,
 * чьё решение нужно. Перед этим все видят, что произошло за столом.
 */
export function PassDeviceOverlay() {
  const game = useGame();
  const takeSeat = useGameStore((store) => store.takeSeat);
  const actor = getPlayer(game, getActorId(game));
  const { title, hint } = describePrompt(game, game.prompt);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[32px] border-2 border-bang-plate/70 bg-[#f7ead7] px-10 py-10 text-center shadow-2xl">
        <p className="font-body text-lg uppercase tracking-[0.2em] text-bang-brown/70">Передайте экран</p>
        <h2 className="mt-3 font-title text-6xl text-bang-red">{actor.name}</h2>
        <p className="mt-2 font-title text-3xl text-bang-brown">{title}</p>
        <p className="mt-3 font-body text-lg text-bang-brown/80">{hint}</p>

        <div className="mt-6 text-left">
          <GameLog limit={4} variant="light" />
        </div>

        <div className="mt-8">
          <BangButton className="scale-75" onClick={takeSeat}>
            Я — {actor.name}
          </BangButton>
        </div>
        <p className="mt-2 font-body text-sm text-bang-brown/60">
          После нажатия будут видны ваши карты и роль: {ROLE_LABELS[actor.role]}, {getCharacter(actor.characterId).name}
        </p>
      </div>
    </div>
  );
}
