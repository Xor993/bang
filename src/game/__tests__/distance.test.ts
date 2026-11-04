import { describe, expect, it } from 'vitest';
import { getDistance } from '../rules/distance';
import { getValidTargets } from '../rules/playability';
import { card, makeGame } from './helpers';

const five = () => makeGame([{}, {}, {}, {}, {}]);

describe('Расстояние (стр. 4, 8)', () => {
  it('считается по кратчайшей стороне стола', () => {
    const game = five();
    expect(getDistance(game, 'p1', 'p2')).toBe(1);
    expect(getDistance(game, 'p1', 'p3')).toBe(2);
    expect(getDistance(game, 'p1', 'p4')).toBe(2);
    expect(getDistance(game, 'p1', 'p5')).toBe(1);
  });

  it('выбывшие игроки не учитываются', () => {
    const game = makeGame([{}, { isEliminated: true }, {}, {}, {}]);
    expect(getDistance(game, 'p1', 'p3')).toBe(1);
  });

  it('«Мустанг» добавляет 1, «Прицел» отнимает 1', () => {
    const game = makeGame([{ inPlay: [card('SCOPE')] }, { inPlay: [card('MUSTANG')] }, {}, {}, {}]);
    expect(getDistance(game, 'p1', 'p2')).toBe(1); // 1 + 1 − 1
    expect(getDistance(game, 'p1', 'p3')).toBe(1); // 2 − 1
    expect(getDistance(game, 'p3', 'p2')).toBe(2); // 1 + 1
  });

  it('модификаторы складываются до ограничения единицей: «Прицел» против Неуловимого Джо по соседству = 1', () => {
    const game = makeGame([{ inPlay: [card('SCOPE')] }, { characterId: 'paul_regret' }, {}, {}]);
    expect(getDistance(game, 'p1', 'p2')).toBe(1);
  });

  it('Неуловимый Джо с «Мустангом» — +2; Рози с «Прицелом» — −2', () => {
    const joe = makeGame([{}, {}, { characterId: 'paul_regret', inPlay: [card('MUSTANG')] }, {}, {}, {}]);
    expect(getDistance(joe, 'p1', 'p3')).toBe(4);

    const rose = makeGame([{ characterId: 'rose_doolan', inPlay: [card('SCOPE')] }, {}, {}, {}, {}, {}, {}]);
    expect(getDistance(rose, 'p1', 'p4')).toBe(1);
  });

  it('оружие задаёт дальность, но не меняет расстояние', () => {
    const bang = card('BANG');
    const withColt = makeGame([{ hand: [bang] }, {}, {}, {}, {}]);
    expect(getValidTargets(withColt, 'p1', bang).sort()).toEqual(['p2', 'p5']);

    const withSchofield = makeGame([{ hand: [bang], inPlay: [card('SCHOFIELD')] }, {}, {}, {}, {}]);
    expect(getValidTargets(withSchofield, 'p1', bang)).toHaveLength(4);
    expect(getDistance(withSchofield, 'p1', 'p3')).toBe(2);
  });

  it('«Паника!» — только на расстоянии 1, независимо от оружия', () => {
    const panic = card('PANIC');
    const game = makeGame([
      { hand: [panic], inPlay: [card('WINCHESTER')] },
      { hand: [card('BEER')] },
      { hand: [card('BEER')] },
      { hand: [card('BEER')] },
    ]);
    expect(getValidTargets(game, 'p1', panic).sort()).toEqual(['p2', 'p4']);
  });
});
