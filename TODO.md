# TODO — Easy Triads

Things that need YOU (not code), in priority order. Check off as you go.

---

## SEO

### 1. Verify the site in Google Search Console (~5 minutes)

1. Go to https://search.google.com/search-console and sign in.
2. Click **Add property** → **URL prefix** → enter `https://easy-triads.vercel.app`
3. Pick **HTML tag** as the verification method. Google gives you a `<meta name="google-site-verification" content="…" />` snippet.
4. Tell me the verification token and I'll add it to `src/app/layout.tsx` (Next has a built-in `verification` field on `Metadata`).
5. Once verified, in Search Console:
   - **Sitemaps** → submit `https://easy-triads.vercel.app/sitemap.xml`
   - **URL Inspection** → paste the homepage URL → click **Request indexing**.
6. Repeat the verification + sitemap submission for **Bing Webmaster Tools** at https://www.bing.com/webmasters (Bing also feeds DuckDuckGo / Ecosia).

---

### 2. Custom domain (~30 minutes once you have the domain)

The site currently lives at `easy-triads.vercel.app`. A custom domain looks more legitimate and is easier to share.

1. Buy a domain from any registrar (Namecheap, Cloudflare, Google Domains, etc.). Suggested: `easytriads.com`, `easy-triads.com`, or `easytriads.app`.
2. In Vercel: project **Settings** → **Domains** → **Add** your domain. Vercel will give you DNS records (usually an A record + a CNAME for `www`).
3. At your registrar, add those DNS records.
4. Once Vercel shows the domain as **Verified** (usually 5–60 minutes), tell me the domain and I'll:
   - Update `SITE_URL` in `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/opengraph-image.tsx`.
   - Re-deploy. Vercel auto-redirects the old `easy-triads.vercel.app` to the new domain so existing links don't break.
5. After the domain is live, re-submit the sitemap in Search Console under the new property.

---

### 3. Backlinks (ongoing)

The single biggest lever for ranking. Strategies in order of effort:

- **Reddit** — post a "I built a free tool to learn guitar triads" thread in:
  - r/Guitar (~3M members)
  - r/guitarlessons
  - r/musictheory
  - r/learnmusic
  - r/jazzguitar (the audience that cares most about triads)
  Do not just drop a link. Write a short post about why you built it, screenshot the board, then link.
- **YouTube comments** under videos about guitar triads — leave a useful comment that mentions your tool only when relevant.
- **Hacker News** — Show HN: Easy Triads. Post during US business hours (Tue–Thu, ~9am ET). One shot, make it count.
- **Indie Hackers** — Share Your Project section.
- **Product Hunt** — only do this once you're ready for traffic; takes ~1 day to prep.
- **Forum signatures** — if you hang out on Ultimate-Guitar, TalkBass, etc., add your URL to your signature.
- **Outreach** — find 10 guitar bloggers / YouTubers who teach theory; send a short email asking if they'd try the tool. Don't ask for a link; if they like it they'll mention it.

Track which backlinks land at https://search.google.com/search-console → **Links** → **Top linking sites**.

---

### 4. Indexable text on the home page (already done)

Status: ✅ `/about` page added with ~600 words covering what triads are, why learn them, how to use the app, and an FAQ with structured data.

---

## Other

### 5. Analytics

Right now there's no way to know how many people visit. Pick one:

- **Vercel Analytics** — easiest, one-click in the project settings, free for hobby tier.
- **Plausible** — privacy-respecting, $9/month for the smallest plan. Public dashboard if you want to share traffic numbers as social proof.
- **Google Analytics 4** — free, the most data, but it's Google.

Tell me which one and I'll wire it up.

### 6. Social presence

- Reserve `@easytriads` on Twitter / X (the `creator` field in the Twitter card already points there).
- Maybe Instagram / Threads if you want to post chord-of-the-day content.

### 7. Donations / monetization (later)

If the tool gets traction and you want to keep it free:
- "Buy me a coffee" link in the footer.
- Patreon for behind-the-scenes / extra sequences.
- Affiliate links for guitar gear / books in the footer.

Out of scope for now — bring it up when there's traffic worth monetizing.
