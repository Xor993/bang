import { AboutSection } from './AboutSection';
import { HeroSection } from './HeroSection';

export function HomePageContent() {
  return (
    <>
      <HeroSection />
      <hr className="mx-[50px] border-t border-bang-brown" />
      <AboutSection />
    </>
  );
}
