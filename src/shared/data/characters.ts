import type { CharacterId } from '../types/game';

export interface Character {
  id: CharacterId;
  name: string;
  hp: number;
  description: string;
}

export const getCharacterArtSrc = (characterId: CharacterId) =>
  `/images/rules/character-${characterId}.svg`;

export const CHARACTERS: Character[] = [
  {
    id: 'slab_the_killer',
    name: 'Киллер Слэб',
    hp: 4,
    description: 'Чтобы отменить его «Бэнг!», цель должна сыграть 2 «Промах!».',
  },
  {
    id: 'calamity_janet',
    name: 'Бедствие Жанет',
    hp: 4,
    description: '«Бэнг!» и «Промах!» для неё — одно и то же.',
  },
  {
    id: 'black_jack',
    name: 'Блэк Джек',
    hp: 4,
    description: 'При наборе показывает вторую карту: если червы или бубны — берёт ещё одну.',
  },
  {
    id: 'vulture_sam',
    name: 'Сэм Стервятник',
    hp: 4,
    description: 'Когда погибает игрок, забирает все его карты в руку.',
  },
  {
    id: 'bart_cassidy',
    name: 'Барт Кэссиди',
    hp: 4,
    description: 'Каждый раз, теряя очко жизни, немедленно берёт карту из колоды.',
  },
  {
    id: 'lucky_duke',
    name: 'Счастливчик Дюк',
    hp: 4,
    description: 'При проверке переворачивает 2 карты из колоды и выбирает лучшую.',
  },
  {
    id: 'el_gringo',
    name: 'Эль Гринго',
    hp: 3,
    description: 'Получив ранение от игрока, забирает у него карту из руки.',
  },
  {
    id: 'jesse_jones',
    name: 'Джесси Джонс',
    hp: 4,
    description: 'Первую карту набора может взять из руки другого игрока.',
  },
  {
    id: 'kit_carson',
    name: 'Кит Карлсон',
    hp: 4,
    description: 'Выбирает две из трёх верхних карт колоды и забирает их.',
  },
  {
    id: 'willy_the_kid',
    name: 'Малыш Вилли',
    hp: 4,
    description: 'Может сыграть любое количество «Бэнг!» за ход.',
  },
  {
    id: 'paul_regret',
    name: 'Поль Огорчение',
    hp: 3,
    description: 'Все игроки видят его на 1 единицу дальше.',
  },
  {
    id: 'suzy_lafayette',
    name: 'Сьюзи Лафейетт',
    hp: 4,
    description: 'Как только на руке не осталось карт, берёт карту из отбоя.',
  },
  {
    id: 'sid_ketchum',
    name: 'Сид Кетчум',
    hp: 4,
    description: 'Может сбросить 2 карты с руки, чтобы восстановить 1 жизнь.',
  },
  {
    id: 'pedro_ramirez',
    name: 'Педро Рамирез',
    hp: 4,
    description: 'Первую карту набора может взять из колоды или с верха отбоя.',
  },
  {
    id: 'rose_doolan',
    name: 'Роза Дулан',
    hp: 4,
    description: 'Видит всех игроков на 1 единицу ближе.',
  },
  {
    id: 'jourdonnais',
    name: 'Джорданнас',
    hp: 4,
    description: 'Может тянуть червы из колоды, чтобы избежать «Бэнг!» (как «Бочка»).',
  },
];
