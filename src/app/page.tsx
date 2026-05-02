import Link from "next/link";
import { Board } from "@/components/board";
import { ThemeToggle } from "@/components/theme-toggle";

const SITE_URL = "https://easy-triads.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}#webapp`,
      name: "Easy Triads",
      url: SITE_URL,
      description:
        "Learn guitar triads with drag-and-drop flashcards across major, minor, and diminished qualities on every string set.",
      applicationCategory: "EducationalApplication",
      applicationSubCategory: "Music Theory",
      operatingSystem: "Any (web)",
      browserRequirements: "Modern browser with JavaScript enabled",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "36 movable triad shapes",
        "Major, minor, and diminished qualities",
        "All four string sets (1-2-3, 2-3-4, 3-4-5, 4-5-6)",
        "Root, 1st inversion, and 2nd inversion",
        "Drag-and-drop study board",
        "Nylon guitar audio playback",
        "Sequence presets and theory cards",
      ],
    },
    {
      "@type": "LearningResource",
      "@id": `${SITE_URL}#learning-resource`,
      name: "Guitar Triads Flashcards",
      url: SITE_URL,
      description:
        "Interactive flashcards for learning every triad shape on guitar.",
      educationalLevel: "Beginner to Intermediate",
      learningResourceType: "Interactive Resource",
      teaches:
        "Guitar triad fingerings, chord inversions, and string-set fluency",
      audience: { "@type": "Audience", audienceType: "Guitar players" },
      isAccessibleForFree: true,
      inLanguage: "en",
    },
  ],
};

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header
        className="h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 border-b"
        style={{
          background: "var(--paper)",
          borderColor: "var(--rule)",
        }}
      >
        <div className="flex items-baseline gap-4 min-w-0">
          <h1
            className="text-2xl sm:text-[22px] font-normal tracking-tight truncate"
            style={{
              fontFamily: 'var(--font-serif), "Source Serif 4", Georgia, serif',
              color: "var(--ink)",
              letterSpacing: "-0.02em",
            }}
          >
            Easy Triads
          </h1>
          <span
            className="text-[13px] hidden md:inline tracking-wide"
            style={{ color: "var(--ink-2)", letterSpacing: "0.025em" }}
          >
            10 mins a day · trust the process
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div
            className="text-[12px] hidden md:flex gap-6 font-display uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            <span>36 shapes</span>
            <span>3 qualities</span>
            <span>4 string sets</span>
          </div>
          <a
            href="https://ko-fi.com/spacehaze"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-display uppercase tracking-widest text-[color:var(--muted)] hover:text-[color:var(--accent)] transition-colors"
          >
            Donate
          </a>
          <ThemeToggle />
          <Link
            href="/about"
            className="text-[12px] font-display uppercase tracking-widest hover:brightness-125"
            style={{ color: "var(--ink-2)" }}
          >
            About
          </Link>
        </div>
      </header>
      <main id="main-content" className="flex flex-col flex-1 min-h-0">
        <Board />
      </main>
    </div>
  );
}
