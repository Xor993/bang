import type { Card, CardColor, EffectType, Suit, CardValue } from '../types/game';

const createCard = (
  id: string, 
  name: string, 
  color: CardColor, 
  suit: Suit, 
  value: CardValue, 
  effectType: EffectType, 
  description: string, 
  range?: number
): Card => ({
  id,
  name,
  color,
  suit,
  value,
  effectType,
  description,
  range,
});

export const INITIAL_DECK: Card[] = [  
  ...Array.from({ length: 25 }, (_, i) =>
    createCard(`bang-${i + 1}`, 'Бэнг!', 'brown', ['spades', 'diamonds', 'hearts', 'clubs'][i % 4] as Suit, ['A', '2', 'Q', '9'][i % 4] as CardValue, 'BANG', 'Выстрел в игрока на вашей дистанции.'),
  ),
  ...Array.from({ length: 12 }, (_, i) =>
    createCard(`missed-${i + 1}`, 'Мимо!', 'brown', ['spades', 'clubs', 'hearts', 'diamonds'][i % 4] as Suit, ['10', 'K', '2', '7'][i % 4] as CardValue, 'MISSED', 'Отменяет эффект выстрела.'),
  ),
  ...Array.from({ length: 6 }, (_, i) =>
    createCard(`beer-${i + 1}`, 'Пиво', 'brown', ['hearts', 'diamonds'][i % 2] as Suit, ['6', 'J'][i % 2] as CardValue, 'BEER', 'Восстанавливает 1 единицу здоровья.'),
  ),
  ...Array.from({ length: 4 }, (_, i) =>
    createCard(`panic-${i + 1}`, 'Паника!', 'brown', ['hearts', 'diamonds', 'spades', 'clubs'][i % 4] as Suit, ['A', '8', 'J', 'Q'][i % 4] as CardValue, 'PANIC', 'Возьмите карту у игрока на расстоянии 1.'),
  ),
  ...Array.from({ length: 4 }, (_, i) =>
    createCard(`cat-balou-${i + 1}`, 'Красотка', 'brown', ['diamonds', 'hearts', 'clubs', 'spades'][i % 4] as Suit, ['9', '10', 'J', 'K'][i % 4] as CardValue, 'CAT_BALOU', 'Сбросьте карту у любого игрока.'),
  ),
  ...Array.from({ length: 3 }, (_, i) =>
    createCard(`duel-${i + 1}`, 'Дуэль', 'brown', ['clubs', 'spades', 'diamonds'][i % 3] as Suit, ['Q', '8', 'A'][i % 3] as CardValue, 'DUEL', 'Вызовите игрока на дуэль.'),
  ),
  ...Array.from({ length: 2 }, (_, i) =>
    createCard(`stagecoach-${i + 1}`, 'Дилижанс', 'brown', ['spades', 'hearts'][i % 2] as Suit, ['9', '9'][i % 2] as CardValue, 'STAGECOACH', 'Возьмите 2 карты из колоды.'),
  ),
  createCard('wells-fargo-1', 'Уэллс Фарго', 'brown', 'hearts', '3', 'WELLS_FARGO', 'Возьмите 3 карты из колоды.'),
  ...Array.from({ length: 2 }, (_, i) =>
    createCard(`indians-${i + 1}`, 'Индейцы!', 'brown', ['diamonds', 'hearts'][i % 2] as Suit, ['K', 'A'][i % 2] as CardValue, 'INDIANS', 'Все остальные игроки сбрасывают Бэнг или теряют 1 здоровье.'),
  ),
  ...Array.from({ length: 2 }, (_, i) =>
    createCard(`general-store-${i + 1}`, 'Магазин', 'brown', ['clubs', 'spades'][i % 2] as Suit, ['9', 'Q'][i % 2] as CardValue, 'GENERAL_STORE', 'Откройте карты по числу игроков, затем каждый берет по одной.'),
  ),
  createCard('saloon-1', 'Салун', 'brown', 'hearts', '5', 'SALOON', 'Все игроки восстанавливают по 1 здоровью.'),
  createCard('gatling-1', 'Гатлинг', 'brown', 'hearts', '10', 'GATLING', 'Наносит урон всем остальным игрокам.'),

  ...Array.from({ length: 2 }, (_, i) =>
    createCard(`barrel-${i + 1}`, 'Бочка', 'blue', ['spades', 'clubs'][i % 2] as Suit, ['Q', 'K'][i % 2] as CardValue, 'BARREL', 'Проверка: если выпали черви, вы уклонились от выстрела.'),
  ),
  ...Array.from({ length: 2 }, (_, i) =>
    createCard(`mustang-${i + 1}`, 'Мустанг', 'blue', ['hearts', 'spades'][i % 2] as Suit, ['8', '9'][i % 2] as CardValue, 'MUSTANG', 'Ваша дистанция для других игроков увеличивается на 1.'),
  ),
  createCard('scope-extra-1', 'Прицел', 'blue', 'diamonds', 'A', 'SCOPE', 'Ваша дистанция до других игроков уменьшается на 1.'),
  ...Array.from({ length: 3 }, (_, i) =>
    createCard(`jail-${i + 1}`, 'Тюрьма', 'blue', ['spades', 'hearts', 'clubs'][i % 3] as Suit, ['J', '10', '9'][i % 3] as CardValue, 'JAIL', 'Положите перед игроком: он может пропустить следующий ход.'),
  ),
  createCard('dynamite-1', 'Динамит', 'blue', 'hearts', '2', 'DYNAMITE', 'Передается по кругу и может взорваться в начале хода.'),

  ...Array.from({ length: 2 }, (_, i) =>
    createCard(`volcanic-${i + 1}`, 'Волканик', 'blue', ['spades', 'clubs'][i % 2] as Suit, ['10', '10'][i % 2] as CardValue, 'WEAPON', 'Дальность 1. Можно играть любое количество Бэнгов.', 1),
  ),
  ...Array.from({ length: 3 }, (_, i) =>
    createCard(`schofield-${i + 1}`, 'Скофилд', 'blue', ['clubs', 'spades', 'diamonds'][i % 3] as Suit, ['J', 'Q', 'K'][i % 3] as CardValue, 'WEAPON', 'Оружие. Дальность: 2.', 2),
  ),
  createCard('remington-1', 'Ремингтон', 'blue', 'diamonds', 'K', 'WEAPON', 'Оружие. Дальность: 3.', 3),
  createCard('carabine-1', 'Карабин', 'blue', 'hearts', 'A', 'WEAPON', 'Оружие. Дальность: 4.', 4),
  createCard('winchester-1', 'Винчестер', 'blue', 'spades', '8', 'WEAPON', 'Оружие. Дальность: 5.', 5),
];

export const getShuffledDeck = (): Card[] => {
  const deck = [...INITIAL_DECK];

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};
