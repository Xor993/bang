import { describe, expect, it } from 'vitest';
import { canPlayCard } from '../rules/playability';
import { card, makeGame, player, PLAIN, run } from './helpers';

describe('Ход: набор и сброс (стр. 3–4)', () => {
  it('набор — 2 верхние карты, затем фаза розыгрыша', () => {
    const game = run(
      makeGame([{ characterId: 'willy_the_kid' }, {}, {}, {}], { phase: 'DRAW', deck: [card('BEER'), card('BANG'), card('MISSED')] }),
      { type: 'DRAW_CARDS' },
    );
    expect(player(game, 'p1').hand).toHaveLength(2);
    expect(game.phase).toBe('PLAY');
  });

  it('пустая колода пополняется перемешанным сбросом', () => {
    const game = run(
      makeGame([{ characterId: 'willy_the_kid' }, {}, {}, {}], { phase: 'DRAW', deck: [], discard: [card('BEER'), card('BANG')] }),
      { type: 'DRAW_CARDS' },
    );
    expect(player(game, 'p1').hand).toHaveLength(2);
    expect(game.discard).toHaveLength(0);
  });

  it('в конце хода лишние карты сверх здоровья сбрасываются', () => {
    const hand = [card('BEER'), card('BANG'), card('MISSED')];
    let game = run(makeGame([{ hp: 2, hand }, {}, {}, {}]), { type: 'END_TURN' });
    expect(game.phase).toBe('DISCARD');
    expect(game.activePlayerId).toBe('p1');

    game = run(game, { type: 'DISCARD_CARD', cardId: hand[0].id });
    expect(game.activePlayerId).toBe('p2');
    expect(game.phase).toBe('DRAW');
  });

  it('ход передаётся по часовой стрелке, пропуская выбывших', () => {
    const game = run(makeGame([{}, { isEliminated: true }, {}, {}]), { type: 'END_TURN' });
    expect(game.activePlayerId).toBe('p3');
  });

  it('у вас в игре не может быть двух одинаковых карт; новое оружие заменяет старое', () => {
    const barrel = card('BARREL');
    const game = makeGame([{ hand: [barrel], inPlay: [card('BARREL')] }, {}, {}, {}]);
    expect(canPlayCard(game, 'p1', barrel)).toBe(false);

    const remington = card('REMINGTON');
    const schofield = card('SCHOFIELD');
    const armed = run(makeGame([{ hand: [remington], inPlay: [schofield] }, {}, {}, {}]), { type: 'PLAY_CARD', cardId: remington.id });
    expect(player(armed, 'p1').inPlay).toEqual([remington]);
    expect(armed.discard).toEqual([schofield]);
  });
});

describe('Персонажи в фазе набора', () => {
  it('Бешеный Пёс тянет третью карту, если вторая красная', () => {
    const deck = [card('BANG'), card('BEER', '7♦'), card('MISSED')]; // верх колоды — конец массива
    const game = run(makeGame([{ characterId: 'black_jack' }, {}, {}, {}], { phase: 'DRAW', deck }), { type: 'DRAW_CARDS' });
    expect(player(game, 'p1').hand).toHaveLength(3);
  });

  it('Кит Карсон оставляет 2 из 3 карт, одну возвращает на верх колоды', () => {
    const [a, b, c] = [card('BANG'), card('BEER'), card('MISSED')];
    let game = run(makeGame([{ characterId: 'kit_carson' }, {}, {}, {}], { phase: 'DRAW', deck: [a, b, c] }), { type: 'DRAW_CARDS' });
    expect(game.prompt).toMatchObject({ kind: 'KIT_CARSON_RETURN' });
    game = run(game, { type: 'KIT_CARSON_RETURN', cardId: b.id });
    expect(player(game, 'p1').hand.map((x) => x.id).sort()).toEqual([a.id, c.id].sort());
    expect(game.deck.at(-1)).toBe(b);
    expect(game.phase).toBe('PLAY');
  });

  it('Туко может взять первую карту с верха сброса', () => {
    const top = card('BEER');
    let game = run(
      makeGame([{ characterId: 'pedro_ramirez' }, {}, {}, {}], { phase: 'DRAW', deck: [card('BANG')], discard: [top] }),
      { type: 'DRAW_CARDS' },
    );
    game = run(game, { type: 'CHOOSE_DRAW_SOURCE', source: 'discard' });
    expect(player(game, 'p1').hand).toContain(top);
    expect(player(game, 'p1').hand).toHaveLength(2);
  });

  it('Джесси Джеймс может вытянуть первую карту с руки соперника', () => {
    const stolen = card('BEER');
    let game = run(
      makeGame([{ characterId: 'jesse_jones' }, { hand: [stolen] }, {}, {}], { phase: 'DRAW', deck: [card('BANG')] }),
      { type: 'DRAW_CARDS' },
    );
    game = run(game, { type: 'CHOOSE_DRAW_SOURCE', source: 'player', playerId: 'p2' });
    expect(player(game, 'p1').hand).toContain(stolen);
    expect(player(game, 'p2').hand).toHaveLength(0);
  });
});

describe('«Динамит» и «Тюрьма» (стр. 9)', () => {
  const startTurnOf = (setup: Parameters<typeof makeGame>[0], deck: ReturnType<typeof card>[]) =>
    run(makeGame(setup, { deck }), { type: 'END_TURN' });

  it('«Динамит» взрывается на пике 2–9: −3 здоровья, карта в сброс', () => {
    const dynamite = card('DYNAMITE', '2♥');
    let game = startTurnOf([{}, { inPlay: [dynamite] }, {}, {}], [card('BANG', '5♠')]);
    expect(game.phase).toBe('TURN_START');
    expect(game.prompt).toMatchObject({ kind: 'TURN_START_CHECK', reason: 'DYNAMITE' });

    game = run(game, { type: 'CHECK_TURN_START' });
    expect(player(game, 'p2').hp).toBe(1);
    expect(player(game, 'p2').inPlay).toHaveLength(0);
    expect(game.discard).toContain(dynamite);
    expect(game.phase).toBe('DRAW');
  });

  it('иначе «Динамит» уходит соседу слева — следующему по ходу игроку', () => {
    const dynamite = card('DYNAMITE');
    const game = run(startTurnOf([{}, { inPlay: [dynamite] }, {}, {}], [card('BANG', 'K♠')]), { type: 'CHECK_TURN_START' });
    expect(player(game, 'p3').inPlay).toContain(dynamite);
    expect(player(game, 'p2').inPlay).toHaveLength(0);
  });

  it('сначала проверяется «Динамит», потом «Тюрьма»; не вышел из тюрьмы — ход пропущен', () => {
    let game = startTurnOf([{}, { inPlay: [card('JAIL'), card('DYNAMITE')] }, {}, {}], [card('BANG', '3♣'), card('BANG', 'K♠')]);
    expect(game.prompt).toMatchObject({ reason: 'DYNAMITE' });
    game = run(game, { type: 'CHECK_TURN_START' });
    expect(game.prompt).toMatchObject({ reason: 'JAIL' });
    game = run(game, { type: 'CHECK_TURN_START' });

    expect(game.activePlayerId).toBe('p3');
    expect(player(game, 'p2').inPlay.some((c) => c.kind === 'JAIL')).toBe(false);
  });

  it('черва освобождает из тюрьмы — ход продолжается', () => {
    const game = run(startTurnOf([{}, { inPlay: [card('JAIL')] }, {}, {}], [card('BANG', 'Q♥')]), { type: 'CHECK_TURN_START' });
    expect(game.activePlayerId).toBe('p2');
    expect(game.phase).toBe('DRAW');
  });

  it('«Тюрьму» нельзя сыграть на шерифа', () => {
    const jail = card('JAIL');
    const game = makeGame([{ role: 'outlaw', hand: [jail] }, { role: 'sheriff' }, { role: 'renegade' }, {}]);
    expect(run(game, { type: 'PLAY_CARD', cardId: jail.id, targetId: 'p2' })).toBe(game);
    const jailed = run(game, { type: 'PLAY_CARD', cardId: jail.id, targetId: 'p3' });
    expect(player(jailed, 'p3').inPlay).toContain(jail);
  });

  it('игрок, погибший от «Динамита», пропускает ход; никто не получает награду', () => {
    const game = run(
      startTurnOf([{}, { hp: 2, characterId: PLAIN, inPlay: [card('DYNAMITE')] }, {}, {}], [card('BANG', '9♠')]),
      { type: 'CHECK_TURN_START' },
    );
    expect(player(game, 'p2').isEliminated).toBe(true);
    expect(game.activePlayerId).toBe('p3');
  });
});
