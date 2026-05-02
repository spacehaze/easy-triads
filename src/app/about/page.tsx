import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://easy-triads.vercel.app";

export const metadata: Metadata = {
  title: "About — What Easy Triads is and how to use it",
  description:
    "Easy Triads teaches guitar triads with 36 movable, drag-and-drop flashcards. Learn major, minor, and diminished shapes on every string set, in every inversion. Free, no signup.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About — What Easy Triads is and how to use it",
    description:
      "Easy Triads teaches guitar triads with 36 movable, drag-and-drop flashcards. Learn major, minor, and diminished shapes on every string set, in every inversion.",
    url: `${SITE_URL}/about`,
    type: "article",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a guitar triad?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "A triad is a three-note chord made of a root, a third, and a fifth. The third decides whether the chord is major (a major third) or minor (a minor third); the fifth can be perfect or diminished. Every common chord on guitar is built from these three intervals.",
      },
    },
    {
      "@type": "Question",
      name: "Why learn triads instead of full barre chords?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Triads are smaller, more transparent voicings. Once you know them on every string set, you can move a chord progression up and down the neck, voice-lead between chords smoothly, and play in tight ensembles without stepping on the bass.",
      },
    },
    {
      "@type": "Question",
      name: "What does Easy Triads cover?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "36 shapes: major, minor, and diminished triads, each in root position, first inversion, and second inversion, on all four three-string sets (1-2-3, 2-3-4, 3-4-5, 4-5-6).",
      },
    },
    {
      "@type": "Question",
      name: "Is Easy Triads free?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. The full deck and all features are free. No signup, no payment, no email required.",
      },
    },
    {
      "@type": "Question",
      name: "Can I hear the chords?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. Each card has a play button that strums the three notes through a nylon-guitar sample, one second apart, so you can hear how the voicing actually sounds.",
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <div
      className="flex flex-col flex-1 overflow-y-auto"
      style={{ color: "#f5e8d4" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <header
        className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between shrink-0 border-b-2"
        style={{
          background:
            "linear-gradient(180deg, rgba(201,129,82,0.08) 0%, rgba(26,14,7,0.95) 100%)",
          borderColor: "#c98152",
          boxShadow: "0 0 24px rgba(201,129,82,0.4)",
        }}
      >
        <Link
          href="/"
          className="font-display text-2xl sm:text-3xl font-bold tracking-widest uppercase"
          style={{
            color: "#c98152",
            textShadow:
              "0 0 8px #c98152, 0 0 18px rgba(201,129,82,0.6), 0 0 32px rgba(201,129,82,0.3)",
            letterSpacing: "0.15em",
          }}
        >
          Easy Triads
        </Link>
        <Link
          href="/"
          className="text-xs font-display uppercase tracking-wider rounded-md px-2.5 py-1 border-2 hover:brightness-110"
          style={{
            color: "#d9c4a0",
            borderColor: "#d9c4a0",
            background: "rgba(255, 165, 0, 0.06)",
          }}
        >
          ← Back to the board
        </Link>
      </header>

      <main id="main-content" className="max-w-5xl mx-auto w-full px-5 sm:px-8 py-10 sm:py-14 space-y-10">
        <section>
          <h1
            className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-widest mb-4"
            style={{
              color: "#c98152",
              textShadow: "0 0 10px rgba(201,129,82,0.6)",
            }}
          >
            About Easy Triads
          </h1>
          <p className="text-lg leading-relaxed">
            <strong>Easy Triads</strong> is a free, browser-based study tool for
            guitarists who want to learn how triads — three-note chords — sit
            on the fretboard. The whole app is one drag-and-drop board. You
            build a study sheet by dropping flashcards onto a canvas, hear how
            the voicings sound, and move on. No signup, no paywall, nothing to
            install.
          </p>
        </section>

        <section>
          <h2
            className="font-display text-2xl uppercase tracking-widest mb-3"
            style={{ color: "#d9c4a0", textShadow: "0 0 8px #d9c4a066" }}
          >
            What you get
          </h2>
          <ul className="list-disc pl-6 space-y-2 leading-relaxed">
            <li>
              <strong>36 movable triad shapes</strong> covering every common
              voicing.
            </li>
            <li>
              Three qualities: <strong>Major</strong>, <strong>minor</strong>,
              and <strong>diminished</strong>.
            </li>
            <li>
              All four three-string sets: <strong>1-2-3</strong>,{" "}
              <strong>2-3-4</strong>, <strong>3-4-5</strong>, and{" "}
              <strong>4-5-6</strong>.
            </li>
            <li>
              All three inversions per shape: <strong>root</strong>,{" "}
              <strong>1st inversion</strong>, and <strong>2nd inversion</strong>.
            </li>
            <li>
              <strong>Sequence presets</strong> like the I-vii° harmonized
              progression in D and C major.
            </li>
            <li>
              <strong>Audio playback</strong> via a nylon-guitar sampler so
              every chord can be heard, not just seen.
            </li>
          </ul>
        </section>

        <section>
          <h2
            className="font-display text-2xl uppercase tracking-widest mb-3"
            style={{ color: "#d9c4a0", textShadow: "0 0 8px #d9c4a066" }}
          >
            Why triads matter
          </h2>
          <p className="leading-relaxed mb-3">
            Triads are the smallest unit of harmony. Once you can find any
            major, minor, or diminished triad on any string set, you can:
          </p>
          <ul className="list-disc pl-6 space-y-2 leading-relaxed">
            <li>
              Outline a chord progression up and down the neck without ever
              moving more than two frets.
            </li>
            <li>
              Voice-lead smoothly between chords by stepping to the closest
              inversion.
            </li>
            <li>
              Stay out of the bass player&apos;s way in a band — three high
              strings is plenty.
            </li>
            <li>
              Build solos and melodies from chord tones instead of guessing at
              scales.
            </li>
          </ul>
        </section>

        <section>
          <h2
            className="font-display text-2xl uppercase tracking-widest mb-3"
            style={{ color: "#d9c4a0", textShadow: "0 0 8px #d9c4a066" }}
          >
            How to use it
          </h2>
          <ol className="list-decimal pl-6 space-y-2 leading-relaxed">
            <li>
              Open the <strong>Triads</strong> tab in the sidebar. Pick a
              quality (Major, minor, or diminished) and a string set.
            </li>
            <li>
              <strong>Drag a card</strong> onto the board. Drop more cards next
              to it to study several voicings together.
            </li>
            <li>
              Hit the <strong>play button</strong> on a card to hear it
              strummed. Click any other card&apos;s play button to interrupt
              and move on.
            </li>
            <li>
              Try a <strong>Sequence preset</strong> from the Sequences tab to
              load a prebuilt progression (like D-major&apos;s I-vii°). Pick a
              key on card 1 and every card relabels with its actual fret
              positions.
            </li>
            <li>
              Your layout is saved automatically — close the tab and come back
              tomorrow to where you left off.
            </li>
          </ol>
        </section>

        <section>
          <h2
            className="font-display text-2xl uppercase tracking-widest mb-3"
            style={{ color: "#d9c4a0", textShadow: "0 0 8px #d9c4a066" }}
          >
            FAQ
          </h2>
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-base mb-1" style={{ color: "#e0d0a8" }}>
                What is a guitar triad?
              </h3>
              <p className="leading-relaxed">
                A triad is a three-note chord made of a root, a third, and a
                fifth. The third decides whether the chord is major (a major
                third) or minor (a minor third); the fifth can be perfect or
                diminished. Every common chord on guitar is built from these
                three intervals.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-1" style={{ color: "#e0d0a8" }}>
                Why learn triads instead of full barre chords?
              </h3>
              <p className="leading-relaxed">
                Triads are smaller, more transparent voicings. Once you know
                them on every string set, you can move a chord progression up
                and down the neck, voice-lead between chords smoothly, and
                play in tight ensembles without stepping on the bass.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-1" style={{ color: "#e0d0a8" }}>
                Is Easy Triads free?
              </h3>
              <p className="leading-relaxed">
                Yes. The full deck and all features are free. No signup, no
                payment, no email required.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-1" style={{ color: "#e0d0a8" }}>
                Can I hear the chords?
              </h3>
              <p className="leading-relaxed">
                Yes. Each card has a play button that strums the three notes
                through a nylon-guitar sample, one second apart, so you can
                hear how the voicing actually sounds.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2
            className="font-display text-2xl uppercase tracking-widest mb-3"
            style={{ color: "#d9c4a0", textShadow: "0 0 8px #d9c4a066" }}
          >
            Start playing
          </h2>
          <p className="leading-relaxed">
            <Link
              href="/"
              className="font-bold underline"
              style={{ color: "#c98152" }}
            >
              Open the board
            </Link>{" "}
            and drop your first card. Then try a sequence and pick a key — the
            cards will tell you exactly which frets to play.
          </p>
        </section>
      </main>
    </div>
  );
}
