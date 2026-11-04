import { BangButton } from '../../shared/ui/BangButton';

export function GameBackLink() {
  return (
    <div className="absolute top-8 left-8 z-30 origin-top-left scale-50">
      <BangButton to="/">Назад</BangButton>
    </div>
  );
}
