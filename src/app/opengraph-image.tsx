import { ImageResponse } from "next/og";

export const alt = "Easy Triads — Drag-and-drop guitar triad flashcards";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(ellipse at top, #3a1f0a 0%, #1a0e07 60%), #1a0e07",
          color: "#f5e8d4",
          padding: "80px 96px",
          position: "relative",
        }}
      >
        {/* Faint mahogany grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(201,129,82,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(201,129,82,0.10) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            display: "flex",
          }}
        />

        {/* Tagline / brand line at top */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#d9c4a0",
            fontSize: 28,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {"// guitar triads · drag-and-drop flashcards"}
        </div>

        {/* Wordmark */}
        <div
          style={{
            position: "relative",
            display: "flex",
            color: "#c98152",
            fontSize: 192,
            fontWeight: 900,
            letterSpacing: "0.10em",
            lineHeight: 1,
            marginTop: 80,
            textShadow:
              "0 0 18px rgba(201,129,82,0.7), 0 0 48px rgba(201,129,82,0.45)",
          }}
        >
          EASY TRIADS
        </div>

        {/* Subtitle */}
        <div
          style={{
            position: "relative",
            display: "flex",
            color: "#f5e8d4",
            fontSize: 40,
            marginTop: 36,
            letterSpacing: "0.02em",
            maxWidth: 880,
            lineHeight: 1.25,
          }}
        >
          36 movable shapes · Major, minor, diminished · every string set
        </div>

        {/* Footer URL */}
        <div
          style={{
            position: "absolute",
            left: 96,
            bottom: 56,
            display: "flex",
            color: "#a8936d",
            fontSize: 26,
            letterSpacing: "0.20em",
            textTransform: "uppercase",
          }}
        >
          easy-triads.vercel.app
        </div>

        {/* Three quality dots at bottom-right */}
        <div
          style={{
            position: "absolute",
            right: 96,
            bottom: 56,
            display: "flex",
            gap: 18,
          }}
        >
          {[
            { color: "#c98152", label: "Major" },
            { color: "#d9c4a0", label: "minor" },
            { color: "#cc6e3a", label: "dim" },
          ].map((d) => (
            <div
              key={d.label}
              style={{
                display: "flex",
                width: 22,
                height: 22,
                borderRadius: 999,
                background: d.color,
                boxShadow: `0 0 16px ${d.color}`,
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
