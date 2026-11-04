import { BangButton } from '../shared/ui/BangButton';
import { PageHeader } from '../components/layout/PageHeader';
import { MOCK_GAME_HISTORY } from '../shared/data/mockGameHistory';

const STATS = [
  { value: '128', label: 'сыграно партий' },
  { value: '61%', label: 'процент побед' },
  { value: '14', label: 'любимых дуэлей' },
  { value: '7', label: 'серия побед' },
] as const;

const ACHIEVEMENTS = [
  {
    title: 'Меткий стрелок',
    description: 'Выиграй 10 партий, нанеся финальный урон картой «Бэнг!».',
  },
  {
    title: 'Живая легенда',
    description: 'Победи за 5 разных персонажей.',
  },
  {
    title: 'Шериф города',
    description: 'Одержи 3 победы подряд за шерифа или помощника.',
  },
] as const;

const FAVORITE_CHARACTERS = [
  {
    name: 'Роза Дулан',
    artSrc: '/images/rules/character-rose_doolan.svg',
    note: 'Любимый стиль: дальние перестрелки и контроль дистанции.',
  },
  {
    name: 'Малыш Вилли',
    artSrc: '/images/rules/character-willy_the_kid.svg',
    note: 'Любимый стиль: агрессия и серия Бэнгов за ход.',
  },
  {
    name: 'Кит Карсон',
    artSrc: '/images/rules/character-kit_carson.svg',
    note: 'Любимый стиль: гибкий набор и тактический добор.',
  },
] as const;

const RECENT_MATCHES = MOCK_GAME_HISTORY.slice(0, 3).map((match) => ({
  result: match.result === 'win' ? 'Победа' : 'Поражение',
  role: match.roleLabel,
  character: match.characterName,
  when: match.playedAt,
}));

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

function SectionCard({ title, children, className = '' }: SectionCardProps) {
  return (
    <section className={`rounded-[32px] border border-[#9a6d33]/20 bg-[#fff7ea] p-8 shadow-[0_16px_40px_rgba(107,74,47,0.12)] ${className}`}>
      <h2 className="font-title text-[44px] leading-none text-bang-red">{title}</h2>
      <div className="mt-5 text-[20px] leading-[1.55] text-bang-brown">{children}</div>
    </section>
  );
}

export function ProfilePage() {
  return (
    <main aria-label="Личный кабинет">
      <PageHeader
        eyebrow="Личный кабинет"
        title="Даниил П."
        description="Твои матчи, статистика, любимые персонажи и быстрый доступ к новой игре."
        actions={
          <>
            <BangButton to="/game">Играть сейчас</BangButton>
            <BangButton to="/history" variant="link" className="text-xl underline underline-offset-4">
              История матчей
            </BangButton>
          </>
        }
        aside={
          <div className="w-full max-w-[420px] rounded-[28px] border border-[#9a6d33]/20 bg-[#fff7ea] p-6 shadow-[0_12px_32px_rgba(107,74,47,0.1)]">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-bang-plate text-[40px] font-title text-bang-red shadow-inner">
                ДП
              </div>
              <div>
                <p className="font-title text-[36px] leading-none text-bang-red">Ковбой-ветеран</p>
                <p className="mt-2 text-[18px] text-bang-brown/80">Уровень 24 · с мая 2026</p>
                <p className="mt-1 text-[16px] text-bang-brown/70">Любимая роль: ренегат</p>
              </div>
            </div>
          </div>
        }
      />

      <section className="site-section flex-col gap-8 !pt-12">
        <SectionCard title="Статистика">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-[24px] bg-[#f8ebd5] px-6 py-5 text-center">
                <div className="font-title text-[54px] leading-none text-bang-red">{stat.value}</div>
                <div className="mt-3 text-[18px] text-bang-brown">{stat.label}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <SectionCard title="Последние матчи">
            <div className="space-y-4">
              {RECENT_MATCHES.map((match) => (
                <div key={`${match.when}-${match.character}`} className="rounded-[24px] border border-bang-plate bg-[#fffdf8] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="font-title text-[34px] text-bang-red">{match.result}</div>
                    <div className="text-[17px] text-bang-brown/70">{match.when}</div>
                  </div>
                  <p className="mt-2 text-[18px]">
                    Роль: <span className="font-semibold">{match.role}</span>
                  </p>
                  <p className="text-[18px]">
                    Персонаж: <span className="font-semibold">{match.character}</span>
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Быстрые действия">
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-[24px] bg-[#f8ebd5] p-5">
                <h3 className="font-title text-[34px] text-bang-red">Новая партия</h3>
                <p className="mt-2 text-[18px]">Сразу перейти к новой игре и начать следующий раунд.</p>
                <BangButton to="/game" className="mt-5">Играть</BangButton>
              </div>

              <div className="rounded-[24px] bg-[#f8ebd5] p-5">
                <h3 className="font-title text-[34px] text-bang-red">Изучить правила</h3>
                <p className="mt-2 text-[18px]">Быстро освежить механику ролей, карт и хода.</p>
                <BangButton to="/rules" className="mt-5">Открыть правила</BangButton>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Любимые персонажи">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {FAVORITE_CHARACTERS.map((character) => (
              <div key={character.name} className="rounded-[26px] border border-bang-plate bg-[#fffdf8] p-5">
                <img
                  src={character.artSrc}
                  alt={character.name}
                  className="mx-auto h-[280px] w-auto rounded-[18px] object-contain shadow-lg"
                />
                <h3 className="mt-5 font-title text-[34px] text-bang-red">{character.name}</h3>
                <p className="mt-2 text-[18px] leading-[1.5]">{character.note}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Достижения">
          <div className="space-y-4">
            {ACHIEVEMENTS.map((achievement, index) => (
              <div key={achievement.title} className="flex flex-col gap-3 rounded-[24px] bg-[#f8ebd5] p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-title text-[34px] text-bang-red">{achievement.title}</h3>
                  <p className="mt-2 text-[18px] leading-[1.5]">{achievement.description}</p>
                </div>
                <div className="shrink-0 rounded-full bg-[#fff7ea] px-5 py-3 text-[18px] font-semibold text-bang-brown">
                  {index === 0 ? 'Открыто' : 'В процессе'}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </main>
  );
}
