export function GameLoadingScreen() {
  return (
    <div className="min-h-screen bg-bang-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h2 className="font-title text-5xl text-bang-red animate-pulse">Раздача карт...</h2>
        <p className="font-body text-bang-brown text-xl">Подготовка игрового стола</p>
      </div>
    </div>
  );
}
