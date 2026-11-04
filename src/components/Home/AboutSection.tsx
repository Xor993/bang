type GameStatProps = {
  iconSrc: string;
  iconAlt: string;
  label: string;
};

function GameStat({ iconSrc, iconAlt, label }: GameStatProps) {
  return (
    <div className="flex items-center gap-4">
      <img src={iconSrc} alt={iconAlt} className="h-12 w-12" />
      <span className="whitespace-nowrap font-title text-[32px] text-bang-red">{label}</span>
    </div>
  );
}

const ABOUT_TEXT =
  '“Бэнг!” - это настольный спагетти-вестерн, в который играют сотни тысяч ковбоев во всем мире. ' +
  'Вы станете одним из легендарных персонажей Дикого запада и вам достанется тайная роль - шерифа, ' +
  'его помощника бандита или ренегата. Средства для ее достижения - в комплекте: дикие мустанги ' +
  'и роковые красотки, салуны и дилижансы, и, конечно, целый арсенал верного оружия. ' +
  'Чью жизнь меткая пуля оборвет первой, - и кто останется в живых в самом конце?';

export function AboutSection() {
  return (
    <section className="site-section items-center justify-between gap-20">
      <div className="flex-1">
        <p className="border-b-2 border-bang-brown pb-10 font-body text-[26px] leading-[1.4] text-bang-brown">
          {ABOUT_TEXT}
        </p>

        <div className="mt-10 flex gap-20">
          <GameStat iconSrc="/images/icon/players.svg" iconAlt="игроки" label="4 - 7 игроков" />
          <GameStat iconSrc="/images/icon/time.svg" iconAlt="время" label="20 - 40 мин" />
        </div>
      </div>

      <div className="flex flex-1 justify-end">
        <img
          src="/images/aboutSectionPhoto.png"
          alt="Револьверы"
          className="max-w-[600px]"
        />
      </div>
    </section>
  );
}
