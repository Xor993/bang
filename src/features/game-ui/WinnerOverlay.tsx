type Props = {
  message: string;
};

export function WinnerOverlay({ message }: Props) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 px-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[32px] border-2 border-bang-plate/70 bg-[#f7ead7] px-10 py-12 text-center shadow-2xl">
        <p className="font-body text-lg uppercase tracking-[0.2em] text-bang-brown/70">Партия завершена</p>
        <h2 className="mt-4 font-title text-6xl text-bang-red">{message}</h2>
      </div>
    </div>
  );
}
