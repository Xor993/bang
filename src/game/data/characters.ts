import type { CharacterId } from '../types';

export interface Character {
  id: CharacterId;
  name: string;
  hp: number;
  description: string;
}

/** Персонажи и их свойства — по правилам (стр. 10–11). */
export const CHARACTERS: Character[] = [
  {
    id: 'slab_the_killer',
    name: 'Ангельские Глазки',
    hp: 4,
    description: 'Требует 2 карт «Мимо!» для отмены своих «Бэнг!». Успешная «Бочка» считается за одну «Мимо!».',
  },
  {
    id: 'calamity_janet',
    name: 'Бедовая Джейн',
    hp: 4,
    description: 'Может играть «Бэнг!» вместо «Мимо!» и наоборот. «Мимо!», сыгранная как «Бэнг!», считается «Бэнг!» этого хода.',
  },
  {
    id: 'black_jack',
    name: 'Бешеный Пёс',
    hp: 4,
    description: 'В фазе набора показывает вторую взятую карту: если это черва или бубна — тянет ещё одну.',
  },
  {
    id: 'vulture_sam',
    name: 'Большой Змей',
    hp: 4,
    description: 'Когда кто-то из соперников убит, забирает на руку все карты с его руки и из игры.',
  },
  {
    id: 'bart_cassidy',
    name: 'Бутч Кэссиди',
    hp: 4,
    description: 'Всякий раз, когда теряет единицу здоровья, тянет карту из колоды.',
  },
  {
    id: 'lucky_duke',
    name: 'Счастливчик Люк',
    hp: 4,
    description: 'Делая проверку, открывает 2 верхние карты колоды и выбирает одну. Обе уходят в сброс.',
  },
  {
    id: 'el_gringo',
    name: 'Джанго',
    hp: 3,
    description: 'За каждую единицу здоровья, потерянную из-за карты соперника, вслепую тянет карту с руки этого соперника.',
  },
  {
    id: 'jesse_jones',
    name: 'Джесси Джеймс',
    hp: 4,
    description: 'В фазе набора может взять первую карту из колоды или вслепую с руки любого соперника.',
  },
  {
    id: 'kit_carson',
    name: 'Кит Карсон',
    hp: 4,
    description: 'В фазе набора тянет 3 карты, оставляет две, а третью возвращает на верх колоды.',
  },
  {
    id: 'willy_the_kid',
    name: 'Малыш Билли',
    hp: 4,
    description: 'В свой ход может сыграть сколько угодно карт «Бэнг!».',
  },
  {
    id: 'paul_regret',
    name: 'Неуловимый Джо',
    hp: 3,
    description: 'Соперники всегда видят его на расстоянии на 1 больше обычного.',
  },
  {
    id: 'suzy_lafayette',
    name: 'Сюзи Лафайет',
    hp: 4,
    description: 'Тянет карту из колоды, как только остаётся без карт на руке.',
  },
  {
    id: 'sid_ketchum',
    name: 'Том Кетчум',
    hp: 4,
    description: 'В любой момент может сбросить 2 карты с руки, чтобы восстановить единицу здоровья.',
  },
  {
    id: 'pedro_ramirez',
    name: 'Туко',
    hp: 4,
    description: 'В фазе набора может взять первую карту из колоды или с верха сброса.',
  },
  {
    id: 'rose_doolan',
    name: 'Хладнокровная Рози',
    hp: 4,
    description: 'Всегда видит соперников на расстоянии на 1 меньше обычного.',
  },
  {
    id: 'jourdonnais',
    name: 'Человек-без-Имени',
    hp: 4,
    description: 'Всюду ходит со своей бочкой: при попадании может сделать проверку — черва отменяет попадание.',
  },
];

const CHARACTERS_BY_ID = new Map(CHARACTERS.map((character) => [character.id, character]));

export const getCharacter = (id: CharacterId): Character => CHARACTERS_BY_ID.get(id)!;

export const getCharacterArtSrc = (id: CharacterId) => `/images/rules/character-${id}.svg`;
