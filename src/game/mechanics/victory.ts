import { addLog } from '../core/log';
import { getAlivePlayers } from '../core/players';
import { WINNER_LABELS } from '../data/roles';
import type { GameState, Winner } from '../types';

/**
 * «Конец игры» (стр. 4):
 * а) Смерть шерифа: если в живых остался только ренегат — побеждает он, иначе бандиты.
 * б) Воцарение порядка: если убиты все бандиты и ренегат — побеждают шериф и помощники.
 */
export function getWinner(state: GameState): Winner | null {
  const alive = getAlivePlayers(state);

  if (!alive.some((player) => player.role === 'sheriff')) {
    return alive.length === 1 && alive[0].role === 'renegade' ? 'RENEGADE' : 'OUTLAWS';
  }

  const lawEnemiesAlive = alive.some((player) => player.role === 'outlaw' || player.role === 'renegade');
  return lawEnemiesAlive ? null : 'LAW';
}

export function checkVictory(state: GameState): GameState {
  const winner = getWinner(state);
  if (!winner) return state;
  return addLog({ ...state, winner, phase: 'GAME_OVER', prompt: null, queue: [] }, `Игра окончена: ${WINNER_LABELS[winner]}.`);
}
