# Lenscase landing page

Open `index.html` in a browser (double-click). No install needed.

## Files
- `index.html`  all text and sections (look for `EDIT` comments)
- `css/style.css`  colours, fonts, spacing (section 1 at the top)
- `js/script.js`  slider timing and scroll speed (top two lines)
- `images/`  your photos (WebP, 1800px max, quality 90)

## Common edits
- **Text:** change words between tags in `index.html`.
- **Colours / fonts:** edit the `:root` block in `style.css`.
- **Add a slide:** copy one `<div class="slide">` in `index.html`.
- **Logo image:** swap the text logo for `<img src="images/logo.svg" alt="Lenscase" height="28">`.
- **Nav order / names:** edit the `<nav>` block; each link must match a section `id`.

## Resizing / replacing images
Keep the same file name to replace a photo. Export at 1800px on the long side (WebP quality 85-90, or JPG 85). Larger gives no visible gain on most screens and slows loading.

## Adding videos (unboxing + overview)
1. Export H.264 MP4 (1080p, 6-10 Mbps) and a WebM (VP9) copy. Put them in a `videos/` folder.
2. Make a poster image (a frame from the video) in `images/`.
3. In `index.html`, delete the two `<span>` lines inside the video frame and uncomment the `<video>` block.
4. For anything over ~2 minutes, upload to Vimeo or YouTube (or Cloudflare Stream / Mux) and paste their embed `<iframe>` instead. They adapt quality to each viewer's connection, which self-hosting cannot.
5. Never autoplay with sound. For a silent background loop use `autoplay muted loop playsinline`.

## Keeping quality high and loading fast
- Host on Netlify, Vercel or Cloudflare Pages: free CDN, HTTPS, automatic compression.
- Keep first screen light: only the first slide image matters for speed.
- Use `loading="lazy"` on images below the fold (already done).
- Always set `width` and `height` on images so the page does not jump while loading.

## Partner logos (Featured In section)
Logos live in `images/partner-*.png`. To add or replace one, edit the `<ul class="partners">` block in `index.html`.
To resize all logos, change `max-height: 56px` in the `.partners img` rule in `css/style.css`.

The faded photo behind the logos is `images/featured-bg.webp`. Replace it with your own image (same name). To dim it more, lower `opacity: .28` in the `.featured-bg` rule.

## Footer, certificate and carousel
- Footer text and the IP India badge are in the `<footer>` block of `index.html`. The badge is display only (not clickable).
- Carousel: each `<div class="slide">` is one image. Remove one to drop it from the carousel.
- Featured In look: see the comment above `.featured` in `style.css` (photo darkness and glass strength).
- Home logo animation: the `.hero-logo img` rule in `style.css` (`6s` = how often it turns once; delete the `animation` part to stop it).
- How it works pictures: `images/step-*.png`.

## Videos
The two square videos are `videos/unboxing.mp4` and `videos/overview.mp4` (1080x1080, H.264). Replace a file (same name) to update it; the poster frames are `images/*-poster.webp`. They autoplay silently on an endless loop (browsers only allow autoplay when muted). To show play controls instead, replace `autoplay muted loop` with `controls` on the `<video>` tag.

## Going live (Cloudflare Pages, free)
1. Create a free account at dash.cloudflare.com, open Workers & Pages, create a Pages project and choose Direct upload.
2. Name the project `lenscase-texra` and drag in this whole folder (the one containing index.html).
3. Your link will be `https://lenscase-texra.pages.dev`. If you had to use a different project name, replace `https://lenscase-texra.pages.dev` with your real link in `index.html`, `robots.txt` and `sitemap.xml`, then upload again.
4. Add the link in Google Search Console (search.google.com/search-console), verify it, submit `sitemap.xml`, then use Request indexing. Do the same in Bing Webmaster Tools.

## Phone animations
Animations play on all phones by default. In `js/script.js`, `RESPECT_REDUCED_MOTION = true` turns the banner slide and logo strip off for phones set to "reduce motion". For the logo spin, add back `@media (prefers-reduced-motion: reduce) { .hero-logo img { animation: none; } }` in `style.css`.

## Video files
`videos/*-mobile.mp4` (720p, no audio) are used automatically on phones and tablets; `videos/unboxing.mp4` and `overview.mp4` (1080p) are used on desktops. Replace all four when you change a video.
