import { describe, expect, it } from 'vitest';
import { canPlayCard } from '../rules/playability';
import { card, makeGame, player, run } from './helpers';

describe('«Бэнг!» и «Мимо!»', () => {
  it('попадание без защиты отнимает единицу здоровья', () => {
    const bang = card('BANG');
    const game = run(makeGame([{ hand: [bang] }, {}, {}, {}]), { type: 'PLAY_CARD', cardId: bang.id, targetId: 'p2' });
    expect(game.prompt).toMatchObject({ kind: 'RESPOND_TO_SHOT', actorId: 'p2' });

    const hit = run(game, { type: 'TAKE_HIT' });
    expect(player(hit, 'p2').hp).toBe(3);
    expect(hit.prompt).toBeNull();
  });

  it('«Мимо!» отменяет попадание', () => {
    const bang = card('BANG');
    const missed = card('MISSED');
    const game = run(
      makeGame([{ hand: [bang] }, { hand: [missed] }, {}, {}]),
      { type: 'PLAY_CARD', cardId: bang.id, targetId: 'p2' },
      { type: 'PLAY_CARD', cardId: missed.id },
    );
    expect(player(game, 'p2').hp).toBe(4);
    expect(game.prompt).toBeNull();
    expect(game.discard.map((c) => c.id)).toEqual([bang.id, missed.id]);
  });

  it('только один «Бэнг!» за ход', () => {
    const [first, second] = [card('BANG'), card('BANG')];
    const game = run(
      makeGame([{ hand: [first, second] }, {}, {}, {}]),
      { type: 'PLAY_CARD', cardId: first.id, targetId: 'p2' },
      { type: 'TAKE_HIT' },
    );
    expect(canPlayCard(game, 'p1', second)).toBe(false);
  });

  it('«Волканик» и Малыш Билли снимают ограничение', () => {
    const second = card('BANG');
    const volcanic = makeGame([{ hand: [second], inPlay: [card('VOLCANIC')] }, {}, {}, {}], { bangsPlayedThisTurn: 1 });
    expect(canPlayCard(volcanic, 'p1', second)).toBe(true);

    const willy = makeGame([{ hand: [second], characterId: 'willy_the_kid' }, {}, {}, {}], { bangsPlayedThisTurn: 1 });
    expect(canPlayCard(willy, 'p1', second)).toBe(true);
  });

  it('«Мимо!» нельзя сыграть в свой ход', () => {
    const missed = card('MISSED');
    expect(canPlayCard(makeGame([{ hand: [missed] }, {}, {}, {}]), 'p1', missed)).toBe(false);
  });

  it('Бедовая Джейн: «Мимо!» как «Бэнг!» засчитывается в лимит; «Бэнг!» как «Мимо!» в ответ', () => {
    const missedAsBang = card('MISSED');
    const bang = card('BANG');
    const game = run(
      makeGame([{ characterId: 'calamity_janet', hand: [missedAsBang, bang] }, {}, {}, {}]),
      { type: 'PLAY_CARD', cardId: missedAsBang.id, targetId: 'p2' },
    );
    expect(game.bangsPlayedThisTurn).toBe(1);
    expect(game.prompt?.kind).toBe('RESPOND_TO_SHOT');

    const attackerBang = card('BANG');
    const defended = run(
      makeGame([{ hand: [attackerBang] }, { characterId: 'calamity_janet', hand: [bang] }, {}, {}]),
      { type: 'PLAY_CARD', cardId: attackerBang.id, targetId: 'p2' },
      { type: 'PLAY_CARD', cardId: bang.id },
    );
    expect(player(defended, 'p2').hp).toBe(4);
  });

  it('Ангельские Глазки: нужно два «Мимо!»', () => {
    const bang = card('BANG');
    const [m1, m2] = [card('MISSED'), card('MISSED')];
    let game = run(
      makeGame([{ characterId: 'slab_the_killer', hand: [bang] }, { hand: [m1, m2] }, {}, {}]),
      { type: 'PLAY_CARD', cardId: bang.id, targetId: 'p2' },
      { type: 'PLAY_CARD', cardId: m1.id },
    );
    expect(game.prompt).toMatchObject({ kind: 'RESPOND_TO_SHOT', missedPlayed: 1 });
    game = run(game, { type: 'PLAY_CARD', cardId: m2.id });
    expect(game.prompt).toBeNull();
    expect(player(game, 'p2').hp).toBe(4);
  });
});

describe('«Бочка» и Человек-без-Имени', () => {
  it('черва отменяет попадание, иначе можно ещё сыграть «Мимо!»', () => {
    const bang = card('BANG');
    const shot = makeGame([{ hand: [bang] }, { inPlay: [card('BARREL')] }, {}, {}], { deck: [card('BANG', '5♥')] });
    const saved = run(shot, { type: 'PLAY_CARD', cardId: bang.id, targetId: 'p2' }, { type: 'USE_DEFENSE', source: 'BARREL' });
    expect(saved.prompt).toBeNull();
    expect(player(saved, 'p2').hp).toBe(4);

    const unlucky = makeGame([{ hand: [bang] }, { inPlay: [card('BARREL')] }, {}, {}], { deck: [card('BANG', '5♠')] });
    const failed = run(unlucky, { type: 'PLAY_CARD', cardId: bang.id, targetId: 'p2' }, { type: 'USE_DEFENSE', source: 'BARREL' });
    expect(failed.prompt).toMatchObject({ kind: 'RESPOND_TO_SHOT', barrelUsed: true });
    expect(run(failed, { type: 'USE_DEFENSE', source: 'BARREL' })).toBe(failed); // вторая проверка запрещена
  });

  it('Человек-без-Имени с «Бочкой» получает две проверки', () => {
    const bang = card('BANG');
    const game = run(
      makeGame([{ hand: [bang] }, { characterId: 'jourdonnais', inPlay: [card('BARREL')] }, {}, {}], {
        deck: [card('BANG', '2♥'), card('BANG', '3♠')],
      }),
      { type: 'PLAY_CARD', cardId: bang.id, targetId: 'p2' },
      { type: 'USE_DEFENSE', source: 'JOURDONNAIS' },
      { type: 'USE_DEFENSE', source: 'BARREL' },
    );
    expect(game.prompt).toBeNull();
    expect(player(game, 'p2').hp).toBe(4);
  });

  it('Счастливчик Люк выбирает одну из двух карт проверки, обе уходят в сброс', () => {
    const bang = card('BANG');
    const hearts = card('BEER', '7♥');
    let game = run(
      makeGame([{ hand: [bang] }, { characterId: 'lucky_duke', inPlay: [card('BARREL')] }, {}, {}], {
        deck: [hearts, card('BANG', '7♠')],
      }),
      { type: 'PLAY_CARD', cardId: bang.id, targetId: 'p2' },
      { type: 'USE_DEFENSE', source: 'BARREL' },
    );
    expect(game.prompt).toMatchObject({ kind: 'CHOOSE_CHECK_CARD', actorId: 'p2' });
    expect(game.discard).toHaveLength(3);

    game = run(game, { type: 'CHOOSE_CHECK_CARD', cardId: hearts.id });
    expect(game.prompt).toBeNull();
    expect(player(game, 'p2').hp).toBe(4);
  });
});

describe('«Гатлинг», «Индейцы!», «Дуэль»', () => {
  it('«Гатлинг» по очереди попадает во всех остальных', () => {
    const gatling = card('GATLING');
    const missed = card('MISSED');
    let game = run(makeGame([{ hand: [gatling] }, {}, { hand: [missed] }, {}]), { type: 'PLAY_CARD', cardId: gatling.id });
    expect(game.prompt?.actorId).toBe('p2');
    game = run(game, { type: 'TAKE_HIT' });
    expect(game.prompt?.actorId).toBe('p3');
    game = run(game, { type: 'PLAY_CARD', cardId: missed.id });
    expect(game.prompt?.actorId).toBe('p4');
    game = run(game, { type: 'TAKE_HIT' });

    expect(game.prompt).toBeNull();
    expect(game.players.map((p) => p.hp)).toEqual([4, 3, 4, 3]);
    expect(game.bangsPlayedThisTurn).toBe(0); // «Гатлинг» — не «Бэнг!»
  });

  it('«Индейцы!»: сбросить «Бэнг!» или потерять здоровье; «Мимо!» не помогает', () => {
    const indians = card('INDIANS');
    const bang = card('BANG');
    const missed = card('MISSED');
    let game = run(makeGame([{ hand: [indians] }, { hand: [bang] }, { hand: [missed] }]), { type: 'PLAY_CARD', cardId: indians.id });
    game = run(game, { type: 'PLAY_CARD', cardId: bang.id });
    expect(canPlayCard(game, 'p3', missed)).toBe(false);
    game = run(game, { type: 'TAKE_HIT' });
    expect(game.players.map((p) => p.hp)).toEqual([4, 4, 3]);
  });

  it('«Дуэль»: игроки по очереди сбрасывают «Бэнг!», проигравший теряет здоровье', () => {
    const duel = card('DUEL');
    const [b1, b2] = [card('BANG'), card('BANG')];
    let game = run(makeGame([{ hand: [duel, b2] }, {}, {}, { hand: [b1] }]), { type: 'PLAY_CARD', cardId: duel.id, targetId: 'p4' });
    game = run(game, { type: 'PLAY_CARD', cardId: b1.id });
    expect(game.prompt).toMatchObject({ kind: 'RESPOND_TO_DUEL', actorId: 'p1' });
    game = run(game, { type: 'PLAY_CARD', cardId: b2.id });
    game = run(game, { type: 'TAKE_HIT' });

    expect(player(game, 'p4').hp).toBe(3);
    expect(game.bangsPlayedThisTurn).toBe(0); // сброшенные в дуэли «Бэнг!» не считаются разыгранными
  });
});
