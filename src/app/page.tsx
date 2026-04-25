import { Board } from "@/components/board";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-white">
      <header className="h-16 px-6 border-b border-zinc-200 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-baseline gap-3">
          <h1 className="text-lg font-bold tracking-tight text-[#1e3a5f]">
            Easy Triads
          </h1>
          <span className="text-xs text-zinc-500 hidden sm:inline">
            Drag-and-drop triad flashcards for guitar
          </span>
        </div>
        <div className="text-xs text-zinc-500">
          36 shapes · 3 qualities · 4 string sets
        </div>
      </header>
      <Board />
    </div>
  );
}
