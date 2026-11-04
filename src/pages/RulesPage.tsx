import { BangButton } from '../shared/ui/BangButton';
import { PageHeader } from '../components/layout/PageHeader';

const ROLE_CARDS = [
  {
    title: 'Шериф',
    description: 'Открывает роль сразу и должен устранить всех бандитов и ренегата.',
  },
  {
    title: 'Помощник',
    description: 'Защищает шерифа и помогает довести партию до победы закона.',
  },
  {
    title: 'Бандит',
    description: 'Стремится убить шерифа раньше, чем это сделают другие.',
  },
  {
    title: 'Ренегат',
    description: 'Побеждает только если остаётся единственным выжившим игроком.',
  },
] as const;

const SETUP_STEPS = [
  'Подготовьте роли по числу игроков, перемешайте и раздайте по одной каждому. Шериф сразу раскрывается.',
  'Раздайте каждому по одному персонажу лицом вверх и возьмите столько патронов, сколько указано на карте.',
  'Шериф получает 1 дополнительную единицу здоровья сверх значения персонажа.',
  'Перемешайте игровую колоду и выдайте каждому на руку столько карт, сколько у него здоровья в начале партии.',
  'Положите колоду в центр стола и оставьте рядом место для стопки сброса.',
] as const;

const TURN_PHASES = [
  {
    title: '1. Набор',
    text: 'Возьмите 2 верхние карты из колоды. Если колода закончилась, перемешайте сброс и сформируйте новую.',
  },
  {
    title: '2. Розыгрыш',
    text: 'Играйте карты на себя и соперников, соблюдая ограничения по Бэнгам, одинаковым картам и оружию.',
  },
  {
    title: '3. Сброс',
    text: 'В конце хода оставьте на руке не больше карт, чем у вас осталось единиц здоровья.',
  },
] as const;

const CARD_GROUPS = [
  {
    title: 'Атака и защита',
    items: [
      '«Бэнг!» наносит 1 урон цели в пределах дистанции оружия.',
      '«Мимо!» отменяет попадание от эффекта с символом Бэнга, даже вне своего хода.',
      '«Отдых» лечит 1 здоровье, а при смертельном ранении может быть сыгран мгновенно.',
    ],
  },
  {
    title: 'Набор и добор',
    items: [
      '«Дилижанс» даёт 2 карты, «Уэллс Фарго» — 3 карты.',
      '«Магазин» открывает карты по числу игроков, затем все по очереди забирают по одной.',
    ],
  },
  {
    title: 'Контроль соперников',
    items: [
      '«Паника!» забирает карту у игрока на расстоянии 1.',
      '«Красотка» заставляет любого игрока сбросить карту, независимо от расстояния.',
      '«Дуэль» и «Индейцы!» заставляют соперников отвечать Бэнгами или терять здоровье.',
    ],
  },
  {
    title: 'Постоянные карты',
    items: [
      'Оружие задаёт максимальную дальность атаки, но не меняет расстояние между игроками.',
      '«Мустанг» увеличивает расстояние до вас для остальных, «Прицел» уменьшает расстояние от вас до соперников.',
      '«Бочка», «Тюрьма» и «Динамит» работают через проверку верхней карты колоды.',
    ],
  },
] as const;

const IMPORTANT_RULES = [
  'За ход можно сыграть только 1 карту «Бэнг!», если только эффект персонажа или оружия не говорит обратное.',
  'У одного игрока не может лежать в игре две одинаковые постоянные карты.',
  'Оружие у игрока может быть только одно; при розыгрыше нового старое сбрасывается.',
  'Выбывший игрок раскрывает роль и сбрасывает все карты с руки и со стола.',
  'Если шериф убивает помощника, он сбрасывает все свои карты.',
  'Игрок, убивший бандита, добирает 3 карты в награду.',
] as const;

const WIN_CONDITIONS = [
  'Шериф и помощники побеждают, когда из игры выведены все бандиты и ренегат.',
  'Бандиты побеждают, когда шериф погибает и ренегат не остался последним выжившим.',
  'Ренегат побеждает только если в финале партии остаётся один против всех и переживает всех остальных.',
] as const;

type CardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

function RulesCard({ title, children, className = '' }: CardProps) {
  return (
    <section className={`rounded-[32px] border border-[#9a6d33]/20 bg-[#fff7ea] p-8 shadow-[0_16px_40px_rgba(107,74,47,0.12)] ${className}`}>
      <h2 className="font-title text-[44px] leading-none text-bang-red">{title}</h2>
      <div className="mt-5 text-[20px] leading-[1.55] text-bang-brown">{children}</div>
    </section>
  );
}

export function RulesPage() {
  return (
    <main aria-label="Правила игры">
      <PageHeader
        eyebrow="Справочник"
        title="Правила игры"
        description="«Бэнг!» — быстрый карточный вестерн для 4–7 игроков. Здесь собраны роли, подготовка, ход, карты и условия победы."
        meta={
          <>
            <span className="rounded-full bg-bang-plate px-5 py-2 font-title text-[24px] text-bang-brown">4–7 игроков</span>
            <span className="rounded-full bg-bang-plate px-5 py-2 font-title text-[24px] text-bang-brown">20–40 минут</span>
            <span className="rounded-full bg-bang-plate px-5 py-2 font-title text-[24px] text-bang-brown">от 8 лет</span>
          </>
        }
        actions={<BangButton to="/game">Начать игру</BangButton>}
      />

      <section className="site-section flex-col gap-8 !pt-12">
        <RulesCard title="О чём игра">
          <p>
            Победа зависит не только от карт на руке, но и от вашей скрытой роли. В начале партии вы знаете не всех
            союзников, поэтому приходится следить за действиями за столом, просчитывать дистанцию, вовремя защищаться
            и не раскрывать намерения слишком рано.
          </p>
        </RulesCard>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <RulesCard title="Роли и цели">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {ROLE_CARDS.map((role) => (
                <div key={role.title} className="rounded-[24px] border border-bang-plate bg-[#fffdf8] p-5">
                  <h3 className="font-title text-[34px] text-bang-red">{role.title}</h3>
                  <p className="mt-2 text-[18px] leading-[1.5]">{role.description}</p>
                </div>
              ))}
            </div>
          </RulesCard>

          <RulesCard title="Подготовка">
            <ol className="space-y-4">
              {SETUP_STEPS.map((step) => (
                <li key={step} className="rounded-[22px] bg-[#f8ebd5] px-5 py-4">
                  {step}
                </li>
              ))}
            </ol>
          </RulesCard>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <RulesCard title="Ход игрока">
            <div className="space-y-4">
              {TURN_PHASES.map((phase) => (
                <div key={phase.title} className="rounded-[24px] border border-[#d9c4a0] bg-[#fffdf8] p-5">
                  <h3 className="font-title text-[34px] text-bang-red">{phase.title}</h3>
                  <p className="mt-2 text-[18px] leading-[1.5]">{phase.text}</p>
                </div>
              ))}
            </div>
          </RulesCard>

          <RulesCard title="Ключевые правила хода">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="rounded-[24px] bg-[#f8ebd5] p-5">
                <img src="/images/rules/distance.svg" alt="Дистанция между игроками" className="mx-auto h-40 object-contain" />
                <p className="mt-4 text-[18px] leading-[1.5]">
                  Расстояние считается по ближайшей стороне стола. Оружие задаёт, на какой дистанции вы стреляете,
                  а не меняет само расстояние.
                </p>
              </div>
              <div className="rounded-[24px] bg-[#f8ebd5] p-5">
                <img src="/images/rules/setup-tablet.svg" alt="Планшет игрока" className="mx-auto h-40 object-contain" />
                <p className="mt-4 text-[18px] leading-[1.5]">
                  Патроны обозначают и здоровье, и лимит карт на руке в конце хода. Чем меньше здоровья, тем меньше
                  карт можно оставить.
                </p>
              </div>
            </div>
          </RulesCard>
        </div>

        <RulesCard title="Главные типы карт">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {CARD_GROUPS.map((group) => (
              <div key={group.title} className="rounded-[24px] border border-bang-plate bg-[#fffdf8] p-5">
                <h3 className="font-title text-[34px] text-bang-red">{group.title}</h3>
                <ul className="mt-3 space-y-3 text-[18px] leading-[1.5]">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </RulesCard>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_1fr]">
          <RulesCard title="Важные ограничения">
            <ul className="space-y-3">
              {IMPORTANT_RULES.map((rule) => (
                <li key={rule} className="rounded-[20px] bg-[#f8ebd5] px-5 py-4">
                  {rule}
                </li>
              ))}
            </ul>
          </RulesCard>

          <RulesCard title="Когда партия заканчивается">
            <ul className="space-y-3">
              {WIN_CONDITIONS.map((condition) => (
                <li key={condition} className="rounded-[20px] bg-[#f8ebd5] px-5 py-4">
                  {condition}
                </li>
              ))}
            </ul>
          </RulesCard>
        </div>

        <RulesCard title="Особенности персонажей">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
            <img
              src="/images/rules/character-rose_doolan.svg"
              alt="Хладнокровная Рози"
              className="mx-auto h-[320px] w-auto rounded-[20px] object-contain shadow-lg"
            />
            <div>
              <p>
                У каждого персонажа в «Бэнг!» есть особое свойство: кто-то стреляет дальше, кто-то лучше проходит
                проверки, кто-то добирает больше карт или лечится эффективнее других.
              </p>
              <p className="mt-4">
                В цифровой версии лучше воспринимать персонажей как разные стили игры: агрессивные, защитные,
                контрольные и тактические. Даже зная базовые правила, состав персонажей заметно меняет темп партии.
              </p>
              <p className="mt-4">
                На этой странице собрана быстрая выжимка правил. Для игровой логики она покрывает основное: роли,
                подготовку, ход, дистанцию, карты и условия победы.
              </p>
            </div>
          </div>
        </RulesCard>
      </section>
    </main>
  );
}
