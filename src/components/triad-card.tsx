import {
  type Triad,
  QUALITY_LABEL,
  QUALITY_COLOR,
  QUALITY_COLOR_SOFT,
  KEY_PROGRESSIONS,
} from "@/lib/triads";
import { playTriad } from "@/lib/audio";

const STRINGS: (1 | 2 | 3 | 4 | 5 | 6)[] = [1, 2, 3, 4, 5, 6];
const FRET_COUNT = 5;

const ROOT_COLOR = "#dc2626";
const NOTE_COLOR = "#18181b";
const INACTIVE_STRING = "#d4d4d8";
const FRET_COLOR = "#e4e4e7";

type Props = {
  triad: Triad;
  compact?: boolean;
  sequenceNumber?: number;
  preview?: boolean;
  selectedKey?: string;
  onKeyChange?: (key: string) => void;
};

export function TriadCard({
  triad,
  compact,
  sequenceNumber,
  preview,
  selectedKey,
  onKeyChange,
}: Props) {
  const width = compact ? 180 : 220;
  const boardWidth = width - 40;
  const boardHeight = 120;
  const paddingLeft = 28;
  const paddingTop = 16;
  const fretSpacing = boardWidth / FRET_COUNT;
  const stringSpacing = boardHeight / 5;

  const stringSet = triad.stringSet as readonly number[];
  const isActive = (s: number) => stringSet.includes(s);

  const accent = QUALITY_COLOR[triad.quality];
  const accentSoft = QUALITY_COLOR_SOFT[triad.quality];
  const chordLabel =
    selectedKey && sequenceNumber
      ? KEY_PROGRESSIONS[selectedKey]?.[sequenceNumber] ?? null
      : null;

  return (
    <div
      className="relative rounded-xl border shadow-sm select-none overflow-hidden"
      style={{ width, background: "#ffffff", borderColor: `${accent}40` }}
    >
      {!preview && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            void playTriad(triad);
          }}
          aria-label="Play chord"
          className="absolute bottom-2 left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform"
          style={{ background: accent, color: "#ffffff" }}
        >
          <svg viewBox="0 0 10 10" width="9" height="9" aria-hidden>
            <polygon points="2,1 9,5 2,9" fill="currentColor" />
          </svg>
        </button>
      )}
      <div
        className="px-3 py-2 border-b"
        style={{ borderColor: `${accent}40`, background: accentSoft }}
      >
        {chordLabel ? (
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div
                className="text-sm font-bold leading-tight truncate"
                style={{ color: accent }}
              >
                {chordLabel.chord}
              </div>
              <div className="text-[10px] opacity-70 mt-0.5" style={{ color: accent }}>
                {chordLabel.notes}
              </div>
            </div>
            {!preview && sequenceNumber === 1 && onKeyChange && (
              <select
                value={selectedKey ?? ""}
                onChange={(e) => onKeyChange(e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 text-[11px] font-bold rounded border px-1.5 py-0.5 cursor-pointer bg-white"
                style={{ color: accent, borderColor: `${accent}66` }}
                aria-label="Sequence key"
              >
                <option value="">KEY</option>
                <option value="D">D</option>
                <option value="A">A</option>
              </select>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div
              className="text-sm font-bold leading-tight"
              style={{ color: accent }}
            >
              {QUALITY_LABEL[triad.quality]}
            </div>
            {!preview && sequenceNumber === 1 && onKeyChange && (
              <select
                value={selectedKey ?? ""}
                onChange={(e) => onKeyChange(e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="text-[11px] font-bold rounded border px-1.5 py-0.5 cursor-pointer bg-white"
                style={{ color: accent, borderColor: `${accent}66` }}
                aria-label="Sequence key"
              >
                <option value="">KEY</option>
                <option value="D">D</option>
                <option value="A">A</option>
              </select>
            )}
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${width} ${boardHeight + 56}`}
        width={width}
        height={boardHeight + 56}
        className="block"
      >
        <text
          x={width - 8}
          y={boardHeight + 50}
          textAnchor="end"
          fontSize={96}
          fontWeight={900}
          fill={accent}
          fillOpacity={0.1}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          style={{ pointerEvents: "none" }}
        >
          {triad.inversion === "root"
            ? "R"
            : triad.inversion === "first"
            ? "1"
            : "2"}
        </text>
        {sequenceNumber !== undefined && (
          <text
            x={width / 2}
            y={paddingTop + ((STRINGS.length - 1) * stringSpacing) / 2 + 14}
            textAnchor="middle"
            fontSize={120}
            fontWeight={900}
            fill={accent}
            fillOpacity={0.22}
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            style={{ pointerEvents: "none" }}
          >
            {sequenceNumber}
          </text>
        )}
        {STRINGS.map((s, i) => {
          const y = paddingTop + i * stringSpacing;
          const active = isActive(s);
          return (
            <g key={`string-${s}`}>
              <text
                x={paddingLeft - 10}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fontWeight={active ? 700 : 400}
                fill={active ? NOTE_COLOR : "#a1a1aa"}
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {s}
              </text>
              <line
                x1={paddingLeft}
                y1={y}
                x2={paddingLeft + boardWidth}
                y2={y}
                stroke={active ? accent : INACTIVE_STRING}
                strokeWidth={active ? 1.5 : 1}
              />
            </g>
          );
        })}

        {Array.from({ length: FRET_COUNT + 1 }).map((_, i) => {
          const x = paddingLeft + i * fretSpacing;
          return (
            <line
              key={`fret-${i}`}
              x1={x}
              y1={paddingTop}
              x2={x}
              y2={paddingTop + (STRINGS.length - 1) * stringSpacing}
              stroke={FRET_COLOR}
              strokeWidth={1}
            />
          );
        })}

        {triad.notes.map((note, i) => {
          const stringIdx = STRINGS.indexOf(note.string);
          const cx =
            paddingLeft + note.fretOffset * fretSpacing + fretSpacing / 2;
          const cy = paddingTop + stringIdx * stringSpacing;
          const isRoot = note.interval === 1;
          return (
            <g key={`note-${i}`}>
              <circle
                cx={cx}
                cy={cy}
                r={9}
                fill={isRoot ? ROOT_COLOR : NOTE_COLOR}
                stroke="#ffffff"
                strokeWidth={1.5}
              />
              <text
                x={cx}
                y={cy + 3}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill="#ffffff"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {note.interval}
              </text>
            </g>
          );
        })}

      </svg>
    </div>
  );
}
