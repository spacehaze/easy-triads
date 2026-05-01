import Link from "next/link";
import { Board } from "@/components/board";

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
        className="h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 border-b-2"
        style={{
          background:
            "linear-gradient(180deg, rgba(201,129,82,0.08) 0%, rgba(26,14,7,0.95) 100%)",
          borderColor: "#c98152",
          boxShadow: "0 0 24px rgba(201,129,82,0.4)",
        }}
      >
        <div className="flex items-baseline gap-3 min-w-0">
          <h1
            className="font-display text-2xl sm:text-3xl font-bold tracking-widest uppercase truncate"
            style={{
              color: "#c98152",
              textShadow:
                "0 0 8px #c98152, 0 0 18px rgba(201,129,82,0.6), 0 0 32px rgba(201,129,82,0.3)",
              letterSpacing: "0.15em",
            }}
          >
            Easy Triads
          </h1>
          <span
            className="text-xs hidden md:inline font-display tracking-wider"
            style={{ color: "#d9c4a0", textShadow: "0 0 6px #d9c4a066" }}
          >
            {"// They are all wrong, forget about them, dedicate 10 mins a day to this site, trust the process"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="text-[10px] hidden md:block font-display uppercase tracking-widest"
            style={{ color: "#a8936d" }}
          >
            36 shapes · 3 qualities · 4 string sets
          </div>
          <Link
            href="/about"
            className="text-[11px] font-display uppercase tracking-widest hover:brightness-125"
            style={{ color: "#d9c4a0", textShadow: "0 0 6px #d9c4a066" }}
          >
            About
          </Link>
        </div>
      </header>
      <Board />
    </div>
  );
}
