import { BangButton } from '../shared/ui/BangButton';
import { PageHeader } from '../components/layout/PageHeader';
import { getCharacter, getCharacterArtSrc, ROLE_LABELS } from '../game';
import { getHistoryStats, MOCK_GAME_HISTORY } from '../shared/data/mockGameHistory';

const stats = getHistoryStats(MOCK_GAME_HISTORY);

function ResultBadge({ result }: { result: 'win' | 'loss' }) {
  const isWin = result === 'win';

  return (
    <span
      className={`inline-flex rounded-full px-4 py-1.5 font-title text-[24px] leading-none ${
        isWin ? 'bg-[#d8ead0] text-[#2f5f2a]' : 'bg-[#f0d6cf] text-[#7a2f1f]'
      }`}
    >
      {isWin ? 'Победа' : 'Поражение'}
    </span>
  );
}

export function HistoryPage() {
  return (
    <main aria-label="История игр">
      <PageHeader
        eyebrow="Личный архив"
        title="История игр"
        description="Все недавние партии: роль, персонаж, результат и короткое описание того, как прошёл матч."
        meta={
          <>
            <span className="rounded-full bg-bang-plate px-5 py-2 font-title text-[24px] text-bang-brown">
              {stats.total} партий
            </span>
            <span className="rounded-full bg-bang-plate px-5 py-2 font-title text-[24px] text-bang-brown">
              {stats.winRate}% побед
            </span>
            <span className="rounded-full bg-bang-plate px-5 py-2 font-title text-[24px] text-bang-brown">
              {stats.wins} / {stats.losses} В/П
            </span>
          </>
        }
        actions={
          <>
            <BangButton to="/game">Новая партия</BangButton>
            <BangButton to="/profile" variant="link" className="text-xl underline underline-offset-4">
              Профиль
            </BangButton>
          </>
        }
      />

      <section className="site-section flex-col gap-6 !pt-12">
        {MOCK_GAME_HISTORY.map((match) => (
          <article
            key={match.id}
            className="rounded-[28px] border border-[#9a6d33]/20 bg-[#fff7ea] p-6 shadow-[0_12px_32px_rgba(107,74,47,0.1)] md:p-8"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <img
                src={getCharacterArtSrc(match.characterId)}
                alt={getCharacter(match.characterId).name}
                className="mx-auto h-[180px] w-[130px] shrink-0 rounded-[14px] object-contain shadow-lg lg:mx-0"
                draggable={false}
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <ResultBadge result={match.result} />
                  <time className="text-[17px] text-bang-brown/70">{match.playedAt}</time>
                </div>

                <h2 className="mt-4 font-title text-[40px] leading-none text-bang-red">{getCharacter(match.characterId).name}</h2>

                <div className="mt-4 flex flex-wrap gap-3 text-[18px] text-bang-brown">
                  <span className="rounded-full bg-[#f8ebd5] px-4 py-2">Роль: {ROLE_LABELS[match.role]}</span>
                  <span className="rounded-full bg-[#f8ebd5] px-4 py-2">{match.playersCount} игроков</span>
                  <span className="rounded-full bg-[#f8ebd5] px-4 py-2">{match.durationMinutes} мин</span>
                </div>

                <p className="mt-4 text-[20px] leading-[1.55] text-bang-brown">{match.summary}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
