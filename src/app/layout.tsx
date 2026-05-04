import type { Metadata, Viewport } from "next";
import { Geist_Mono, Orbitron, Source_Serif_4, VT323 } from "next/font/google";
import "./globals.css";
import { SiteCommentsFooter } from "@/components/site-comments-footer";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: ["400"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const themeInitScript = `(function(){try{var t=localStorage.getItem("triads-theme");if(t!=="light"&&t!=="dark")t="light";document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","light")}})();`;

const SITE_URL = "https://easy-triads.vercel.app";
const SITE_NAME = "Easy Triads";
const TITLE = "Easy Triads — Learn Guitar Triads with Drag-and-Drop Flashcards";
const DESCRIPTION =
  "Learn guitar triads visually with 36 movable flashcards across major, minor, and diminished qualities. Drag, drop, and play any chord shape on every string set — free, no signup.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Easy Triads",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "guitar triads",
    "guitar chord flashcards",
    "guitar theory",
    "music theory app",
    "learn guitar chords",
    "triad shapes",
    "major minor diminished",
    "string sets",
    "chord inversions",
    "guitar practice tool",
    "interactive guitar lesson",
  ],
  authors: [{ name: "Easy Triads" }],
  creator: "Easy Triads",
  publisher: "Easy Triads",
  category: "education",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@easytriads",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#c98152",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${vt323.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <SiteCommentsFooter />
      </body>
    </html>
  );
}
