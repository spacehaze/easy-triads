import {
  type Triad,
  QUALITY_LABEL,
  QUALITY_COLOR,
  QUALITY_COLOR_SOFT,
  KEY_PROGRESSIONS,
  KEY_FRETS,
} from "@/lib/triads";
import { playTriad } from "@/lib/audio";

const STRINGS: (1 | 2 | 3 | 4 | 5 | 6)[] = [1, 2, 3, 4, 5, 6];
const FRET_COUNT = 5;

const ROOT_COLOR = "#ffd700";
const NOTE_COLOR = "#fff2e0";
const INACTIVE_STRING = "#3a2a1a";
const FRET_COLOR = "#2a1f10";

const SEQUENCE_ROMAN: Record<number, string> = {
  1: "I",
  2: "ii",
  3: "iii",
  4: "IV",
  5: "V",
  6: "vi",
  7: "vii",
  8: "I",
};

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

  const maxFretOffset = Math.max(...triad.notes.map((n) => n.fretOffset));
  const visibleFretCount = maxFretOffset + 1;
  const visibleBoardWidth = visibleFretCount * fretSpacing;
  const offsetColumn = (offset: number) => offset;

  const accent = QUALITY_COLOR[triad.quality];
  const accentSoft = QUALITY_COLOR_SOFT[triad.quality];
  const chordRoot =
    selectedKey && sequenceNumber
      ? KEY_PROGRESSIONS[selectedKey]?.[sequenceNumber]?.chord.split(" ")[0]
      : null;
  const fretNumbers =
    selectedKey && sequenceNumber
      ? KEY_FRETS[selectedKey]?.[sequenceNumber] ?? null
      : null;

  return (
    <div
      className="relative rounded-xl border-2 select-none overflow-hidden"
      style={{
        width,
        background: "#0f0a05",
        borderColor: accent,
        boxShadow: `0 0 16px ${accent}66, 0 0 32px ${accent}33, inset 0 0 24px ${accent}11`,
      }}
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
          className="absolute bottom-2 left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          style={{
            background: accent,
            color: "#0f0a05",
            boxShadow: `0 0 12px ${accent}, 0 0 24px ${accent}88`,
          }}
        >
          <svg viewBox="0 0 10 10" width="9" height="9" aria-hidden>
            <polygon points="2,1 9,5 2,9" fill="currentColor" />
          </svg>
        </button>
      )}
      <div
        className="px-3 py-2 border-b flex items-center justify-between gap-2"
        style={{ borderColor: `${accent}66`, background: accentSoft }}
      >
        <div
          className="text-sm font-bold leading-tight tracking-wider"
          style={{ color: accent, textShadow: `0 0 8px ${accent}aa` }}
        >
          {QUALITY_LABEL[triad.quality]}
        </div>
        {!preview && sequenceNumber === 1 && onKeyChange && (
          <select
            value={selectedKey ?? ""}
            onChange={(e) => onKeyChange(e.target.value)}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] font-bold rounded border px-1.5 py-0.5 cursor-pointer"
            style={{ color: accent, borderColor: accent, background: "#0f0a05" }}
            aria-label="Sequence key"
          >
            <option value="">KEY</option>
            <option value="D">D</option>
            <option value="A">A</option>
          </select>
        )}
        {!preview && sequenceNumber !== undefined && sequenceNumber !== 1 && chordRoot && (
          <div
            className="text-[11px] font-bold rounded border px-1.5 py-0.5"
            style={{ color: accent, borderColor: accent, background: "#0f0a05" }}
          >
            {chordRoot}
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
          fillOpacity={0.18}
          fontFamily="var(--font-vt323), ui-monospace, monospace"
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
            fontSize={SEQUENCE_ROMAN[sequenceNumber]?.length > 2 ? 90 : 120}
            fontWeight={900}
            fill={accent}
            fillOpacity={0.3}
            fontFamily="var(--font-vt323), ui-monospace, monospace"
            style={{ pointerEvents: "none" }}
          >
            {SEQUENCE_ROMAN[sequenceNumber] ?? sequenceNumber}
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
                fill={active ? NOTE_COLOR : "#5a4070"}
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {s}
              </text>
              <line
                x1={paddingLeft}
                y1={y}
                x2={paddingLeft + visibleBoardWidth}
                y2={y}
                stroke={active ? accent : INACTIVE_STRING}
                strokeWidth={active ? 1.8 : 1}
                style={
                  active
                    ? { filter: `drop-shadow(0 0 3px ${accent})` }
                    : undefined
                }
              />
            </g>
          );
        })}

        {Array.from({ length: visibleFretCount + 1 }).map((_, i) => {
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

        {fretNumbers &&
          fretNumbers.map((fret, i) => (
            <text
              key={`fret-num-${i}`}
              x={paddingLeft + i * fretSpacing + fretSpacing / 2}
              y={paddingTop + (STRINGS.length - 1) * stringSpacing + 14}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              fill={accent}
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              style={{ textShadow: `0 0 4px ${accent}aa` }}
            >
              {fret}
            </text>
          ))}

        {triad.notes.map((note, i) => {
          const stringIdx = STRINGS.indexOf(note.string);
          const cx =
            paddingLeft + offsetColumn(note.fretOffset) * fretSpacing + fretSpacing / 2;
          const cy = paddingTop + stringIdx * stringSpacing;
          const isRoot = note.interval === 1;
          return (
            <g key={`note-${i}`}>
              <circle
                cx={cx}
                cy={cy}
                r={9}
                fill={isRoot ? ROOT_COLOR : "#0f0a05"}
                stroke={isRoot ? ROOT_COLOR : NOTE_COLOR}
                strokeWidth={1.5}
                style={{
                  filter: isRoot
                    ? `drop-shadow(0 0 5px ${ROOT_COLOR})`
                    : `drop-shadow(0 0 3px ${NOTE_COLOR}aa)`,
                }}
              />
              <text
                x={cx}
                y={cy + 3}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill={isRoot ? "#0f0a05" : NOTE_COLOR}
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
