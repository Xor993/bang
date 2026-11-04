import { describe, expect, it } from 'vitest';
import { canPlayCard } from '../rules/playability';
import { card, makeGame, player, run } from './helpers';

const shoot = (game: ReturnType<typeof makeGame>, bangId: string, targetId: string) =>
  run(game, { type: 'PLAY_CARD', cardId: bangId, targetId }, { type: 'TAKE_HIT' });

describe('Гибель и «Отдых» (стр. 4, 6)', () => {
  it('потеряв последнее здоровье, можно спастись «Отдыхом»', () => {
    const bang = card('BANG');
    const beer = card('BEER');
    let game = shoot(makeGame([{ hand: [bang] }, { hp: 1, hand: [beer] }, {}, {}]), bang.id, 'p2');
    expect(game.prompt).toMatchObject({ kind: 'DYING', actorId: 'p2' });

    game = run(game, { type: 'PLAY_CARD', cardId: beer.id });
    expect(player(game, 'p2').hp).toBe(1);
    expect(player(game, 'p2').isEliminated).toBe(false);
    expect(game.prompt).toBeNull();
  });

  it('«Отдых» не спасает, когда в игре двое; «Салун» при гибели сыграть нельзя', () => {
    const bang = card('BANG');
    const duo = shoot(
      makeGame([{ hand: [bang] }, { hp: 1, role: 'renegade', hand: [card('BEER')] }, { isEliminated: true }]),
      bang.id,
      'p2',
    );
    expect(player(duo, 'p2').isEliminated).toBe(true);

    const saloon = card('SALOON');
    const dying = makeGame([{}, { hand: [saloon] }, {}, {}], { prompt: { kind: 'DYING', actorId: 'p2' } });
    expect(canPlayCard(dying, 'p2', saloon)).toBe(false);
  });

  it('вне смертельного ранения «Отдых» в чужой ход не играется', () => {
    const beer = card('BEER');
    const game = makeGame([{}, { hp: 2, hand: [beer] }, {}, {}]);
    expect(canPlayCard(game, 'p2', beer)).toBe(false);
  });

  it('Том Кетчум спасается, сбрасывая 2 карты', () => {
    const bang = card('BANG');
    const [a, b] = [card('MISSED'), card('PANIC')];
    let game = shoot(makeGame([{ hand: [bang] }, { characterId: 'sid_ketchum', hp: 1, hand: [a, b] }, {}, {}]), bang.id, 'p2');
    expect(game.prompt?.kind).toBe('DYING');
    game = run(game, { type: 'SID_KETCHUM_HEAL', cardIds: [a.id, b.id] });
    expect(player(game, 'p2').hp).toBe(1);
    expect(game.prompt).toBeNull();
  });

  it('выбывший раскрывает роль и сбрасывает карты', () => {
    const bang = card('BANG');
    const game = shoot(
      makeGame([
        { hand: [bang], inPlay: [card('SCHOFIELD')] },
        { hp: 1, role: 'renegade', hand: [card('MISSED')], inPlay: [card('MUSTANG')] },
        {},
        {},
      ]),
      bang.id,
      'p2',
    );
    expect(player(game, 'p2').isEliminated).toBe(true);
    expect(player(game, 'p2').hand).toHaveLength(0);
    expect(game.discard.map((c) => c.kind)).toEqual(expect.arrayContaining(['MISSED', 'MUSTANG']));
  });
});

describe('Штрафы и награды (стр. 4)', () => {
  it('убивший бандита берёт 3 карты', () => {
    const bang = card('BANG');
    const game = shoot(
      makeGame([{ hand: [bang] }, { hp: 1 }, { role: 'renegade' }, {}], { deck: [card('BEER'), card('BEER'), card('BEER')] }),
      bang.id,
      'p2',
    );
    expect(player(game, 'p1').hand).toHaveLength(3);
  });

  it('шериф, убивший помощника, сбрасывает все свои карты', () => {
    const bang = card('BANG');
    const game = shoot(
      makeGame([{ hand: [bang, card('BEER')], inPlay: [card('BARREL')] }, { hp: 1, role: 'deputy' }, { role: 'renegade' }, {}]),
      bang.id,
      'p2',
    );
    expect(player(game, 'p1').hand).toHaveLength(0);
    expect(player(game, 'p1').inPlay).toHaveLength(0);
  });
});

describe('Персонажи, реагирующие на урон и гибель', () => {
  it('Бутч Кэссиди тянет карту за каждую потерянную единицу', () => {
    const bang = card('BANG');
    const game = shoot(makeGame([{ hand: [bang] }, { characterId: 'bart_cassidy' }, {}, {}], { deck: [card('BEER')] }), bang.id, 'p2');
    expect(player(game, 'p2').hand).toHaveLength(1);
  });

  it('Джанго тянет карту с руки стрелявшего', () => {
    const bang = card('BANG');
    const loot = card('BEER');
    const game = shoot(makeGame([{ hand: [bang, loot] }, { characterId: 'el_gringo', hp: 3 }, {}, {}]), bang.id, 'p2');
    expect(player(game, 'p2').hand).toEqual([loot]);
  });

  it('Большой Змей забирает карты погибшего', () => {
    const bang = card('BANG');
    const loot = [card('PANIC'), card('BARREL')];
    const game = shoot(
      makeGame([{ hand: [bang] }, { hp: 1, role: 'renegade', hand: [loot[0]], inPlay: [loot[1]] }, { characterId: 'vulture_sam' }, {}], {
        deck: [card('BEER'), card('BEER'), card('BEER')],
      }),
      bang.id,
      'p2',
    );
    expect(player(game, 'p3').hand).toEqual(loot);
  });

  it('Сюзи Лафайет тянет карту, оставшись без карт', () => {
    const bang = card('BANG');
    const game = run(makeGame([{ characterId: 'suzy_lafayette', hand: [bang] }, {}, {}, {}], { deck: [card('BEER')] }), {
      type: 'PLAY_CARD',
      cardId: bang.id,
      targetId: 'p2',
    });
    expect(player(game, 'p1').hand).toHaveLength(1);
  });
});

describe('Конец игры (стр. 4)', () => {
  const finish = (roles: Parameters<typeof makeGame>[0], targetId: string) => {
    const bang = card('BANG');
    const [first, ...rest] = roles;
    return shoot(makeGame([{ ...first, hand: [bang], inPlay: [card('WINCHESTER')] }, ...rest]), bang.id, targetId);
  };

  it('убиты все бандиты и ренегат — побеждают шериф и помощники', () => {
    const game = finish([{ role: 'sheriff' }, { role: 'outlaw', hp: 1 }, { role: 'deputy' }, { role: 'renegade', isEliminated: true }], 'p2');
    expect(game.winner).toBe('LAW');
    expect(game.phase).toBe('GAME_OVER');
  });

  it('шериф убит, а в живых не один ренегат — побеждают бандиты', () => {
    const game = finish([{ role: 'outlaw' }, { role: 'sheriff', hp: 1 }, { role: 'renegade' }], 'p2');
    expect(game.winner).toBe('OUTLAWS');
  });

  it('ренегат побеждает, только оставшись последним', () => {
    const game = finish([{ role: 'renegade' }, { role: 'sheriff', hp: 1 }, { role: 'outlaw', isEliminated: true }], 'p2');
    expect(game.winner).toBe('RENEGADE');
  });

  it('бандиты выбиты, но ренегат жив — игра продолжается', () => {
    const game = finish([{ role: 'sheriff' }, { role: 'outlaw', hp: 1 }, { role: 'renegade' }], 'p2');
    expect(game.winner).toBeNull();
  });
});

describe('«Магазин»', () => {
  it('открывается по карте на каждого живого игрока, выбирают по часовой стрелке начиная с сыгравшего', () => {
    const store = card('GENERAL_STORE');
    const offered = [card('BEER'), card('BANG'), card('MISSED')];
    let game = run(makeGame([{}, { hand: [store] }, {}], { activePlayerId: 'p2', deck: offered }), { type: 'PLAY_CARD', cardId: store.id });
    expect(game.generalStore).toHaveLength(3);
    expect(game.prompt?.actorId).toBe('p2');

    game = run(game, { type: 'PICK_GENERAL_STORE_CARD', cardId: offered[0].id });
    expect(game.prompt?.actorId).toBe('p3');
    game = run(game, { type: 'PICK_GENERAL_STORE_CARD', cardId: offered[1].id });
    expect(game.prompt?.actorId).toBe('p1');
    game = run(game, { type: 'PICK_GENERAL_STORE_CARD', cardId: offered[2].id });

    expect(game.prompt).toBeNull();
    expect(game.generalStore).toHaveLength(0);
    expect(game.players.map((p) => p.hand.length)).toEqual([1, 1, 1]);
  });
});
