import { Board } from "@/components/board";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <header
        className="h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 border-b-2"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,107,26,0.08) 0%, rgba(10,10,10,0.95) 100%)",
          borderColor: "#ff6b1a",
          boxShadow: "0 0 24px rgba(255,107,26,0.4)",
        }}
      >
        <div className="flex items-baseline gap-3 min-w-0">
          <h1
            className="font-display text-2xl sm:text-3xl font-bold tracking-widest uppercase truncate"
            style={{
              color: "#ff6b1a",
              textShadow:
                "0 0 8px #ff6b1a, 0 0 18px rgba(255,107,26,0.6), 0 0 32px rgba(255,107,26,0.3)",
              letterSpacing: "0.15em",
            }}
          >
            Easy Triads
          </h1>
          <span
            className="text-xs hidden md:inline font-display tracking-wider"
            style={{ color: "#ffa500", textShadow: "0 0 6px #ffa50066" }}
          >
            // drag-and-drop triad flashcards for guitar
          </span>
        </div>
        <div
          className="text-[10px] hidden md:block font-display uppercase tracking-widest"
          style={{ color: "#d4a574" }}
        >
          36 shapes · 3 qualities · 4 string sets
        </div>
      </header>
      <Board />
    </div>
  );
}
