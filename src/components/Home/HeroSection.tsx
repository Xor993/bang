import { BangButton } from '../../shared/ui/BangButton';
import { PageHero } from '../layout/PageHero';

export function HeroSection() {
  return (
    <PageHero centered className="min-h-[1100px]">
      <h1 className="z-10 font-title text-[120px] text-bang-red drop-shadow-md">БЭНГ!</h1>

      <p className="z-10 -mt-6 font-title text-[32px] text-bang-red">Настольная игра — вестерн</p>

      <div className="z-10 mt-10 flex flex-col items-center gap-4">
        <BangButton to="/game">Играть</BangButton>
      </div>
    </PageHero>
  );
}
