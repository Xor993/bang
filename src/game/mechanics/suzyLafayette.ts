import { drawCards } from '../core/cards';
import { addLog } from '../core/log';
import { getAlivePlayers, hasCharacter } from '../core/players';
import type { GameState } from '../types';

/**
 * Сюзи Лафайет «тянет карту из колоды, как только остаётся без карт на руке».
 * Движок вызывает это после каждого действия.
 */
export function applySuzyLafayette(state: GameState): GameState {
  return getAlivePlayers(state)
    .filter((player) => hasCharacter(player, 'suzy_lafayette') && player.hand.length === 0)
    .reduce((next, suzy) => {
      const { state: drawn, cards } = drawCards(next, suzy.id, 1);
      return cards.length > 0 ? addLog(drawn, `${suzy.name} (Сюзи Лафайет) осталась без карт и тянет карту.`) : drawn;
    }, state);
}
