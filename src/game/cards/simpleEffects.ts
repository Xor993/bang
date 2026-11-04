/** Разовые карты без взаимодействия с другими игроками: «Отдых», «Салун», «Дилижанс», «Уэллс Фарго». */
import { drawCards } from '../core/cards';
import { addLog } from '../core/log';
import { doesBeerWork } from '../core/players';
import { heal, healAllAlive } from '../mechanics/health';
import type { GameState } from '../types';

/** «Отдых» восстанавливает 1 здоровье, но «не действует, если в игре остались только двое». */
export const drinkBeer = (state: GameState, playerId: string): GameState =>
  doesBeerWork(state) ? heal(state, playerId) : addLog(state, '«Отдых» не действует, когда в игре двое.');

/** «Салун»: каждый игрок восстанавливает по единице здоровья. */
export const openSaloon = (state: GameState): GameState => healAllAlive(state);

/** «Дилижанс»: возьмите на руку 2 карты. */
export const takeStagecoach = (state: GameState, playerId: string): GameState => drawCards(state, playerId, 2).state;

/** «Уэллс Фарго»: возьмите на руку 3 карты. */
export const takeWellsFargo = (state: GameState, playerId: string): GameState => drawCards(state, playerId, 3).state;
