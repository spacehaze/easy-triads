import {
  type Triad,
  STRING_NAMES,
  QUALITY_LABEL,
  INVERSION_LABEL,
} from "@/lib/triads";

const STRINGS: (1 | 2 | 3 | 4 | 5 | 6)[] = [1, 2, 3, 4, 5, 6];
const FRET_COUNT = 5;

const QUALITY_COLORS: Record<Triad["quality"], string> = {
  major: "#1e3a5f",
  minor: "#1e3a5f",
  diminished: "#1e3a5f",
};

const ROOT_COLOR = "#dc2626";
const NOTE_COLOR = "#18181b";
const ACTIVE_STRING = "#1e3a5f";
const INACTIVE_STRING = "#d4d4d8";
const FRET_COLOR = "#e4e4e7";
const FRET_LABEL_COLOR = "#2563a0";

type Props = {
  triad: Triad;
  compact?: boolean;
};

export function TriadCard({ triad, compact }: Props) {
  const width = compact ? 180 : 220;
  const boardWidth = width - 40;
  const boardHeight = 120;
  const paddingLeft = 28;
  const paddingTop = 16;
  const fretSpacing = boardWidth / FRET_COUNT;
  const stringSpacing = boardHeight / 5;

  const stringSet = triad.stringSet as readonly number[];
  const isActive = (s: number) => stringSet.includes(s);

  const titleColor = QUALITY_COLORS[triad.quality];
  const stringSetLabel = triad.stringSet.join(" ");

  return (
    <div
      className="bg-white rounded-xl border border-zinc-200 shadow-sm select-none overflow-hidden"
      style={{ width }}
    >
      <div
        className="px-3 pt-2 pb-1 border-b"
        style={{ borderColor: "#2563a033" }}
      >
        <div
          className="text-sm font-bold leading-tight"
          style={{ color: titleColor }}
        >
          {QUALITY_LABEL[triad.quality]}
        </div>
        <div className="text-[11px] font-semibold" style={{ color: FRET_LABEL_COLOR }}>
          Strings {stringSetLabel}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${boardHeight + 56}`}
        width={width}
        height={boardHeight + 56}
        className="block"
      >
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
                {STRING_NAMES[s]}
              </text>
              <line
                x1={paddingLeft}
                y1={y}
                x2={paddingLeft + boardWidth}
                y2={y}
                stroke={active ? ACTIVE_STRING : INACTIVE_STRING}
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

        <text
          x={paddingLeft}
          y={paddingTop + (STRINGS.length - 1) * stringSpacing + 16}
          fontSize={10}
          fontWeight={700}
          fill={FRET_LABEL_COLOR}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {triad.startFret}fr
        </text>

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

        <text
          x={width / 2}
          y={boardHeight + 44}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          fill={NOTE_COLOR}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {INVERSION_LABEL[triad.inversion]}
        </text>
      </svg>
    </div>
  );
}
