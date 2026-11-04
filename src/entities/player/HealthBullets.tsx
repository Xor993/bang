import bulletHpIcon from '../../assets/game/bullet-hp.svg';

type Props = {
  currentHp: number;
  maxHp: number;
  compact?: boolean;
};

export function HealthBullets({ currentHp, maxHp, compact }: Props) {
  const sizeClass = compact ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <div className="flex items-center gap-px" aria-label={`${currentHp} из ${maxHp} жизней`}>
      {Array.from({ length: maxHp }).map((_, index) => (
        <img
          key={index}
          src={bulletHpIcon}
          alt=""
          draggable={false}
          className={`${sizeClass} shrink-0 object-contain mix-blend-screen drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)] ${
            index < currentHp ? 'opacity-100' : 'opacity-25 grayscale'
          }`}
          title={`${currentHp}/${maxHp} жизней`}
        />
      ))}
    </div>
  );
}
