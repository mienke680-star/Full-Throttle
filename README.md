# Full Throttle Overlanding Gear and Fitment — Website

A 6-page static website for Full Throttle, a custom manufacturing workshop in Industria, Middelburg, Mpumalanga — vehicle upholstery, overlanding gear, canvas work, protective covers, furniture upholstery and custom manufacturing. Plain HTML/CSS/JS — no build step, no framework, no backend.

This is a full rebuild: entirely new visual system (dark industrial palette with red/green/yellow glow accents, mono + display type pairing, bracket-style buttons, stitch-line dividers), new page architecture, new business information, and a completely repopulated 27-product catalogue.

## Photography

Real Full Throttle project photography is in place across the site, sourced from the customer-supplied photo set and stored in `assets/img/work/` (43 photos, auto-oriented, resized to a max 1800px edge and compressed to ~80KB–850KB JPEGs). Four supplied images were excluded — they were promotional flyer graphics (with an outdated WhatsApp number and old business name baked into the design) rather than photos of actual work, so they weren't suitable for the live site.

- **Home hero**: `index.html` → `.stage-media img` — a cropped version of the canopy + rooftop tent build (`hero-canopy-rooftop-tent.jpg`), tightened to remove the surrounding brick wall and a client vehicle's third-party rental-company decal.
- **Product images**: `js/main.js` → the `PRODUCTS` array (`img` field per item) — real photos for 26 of 27 products.
- **Gallery images**: `js/main.js` → the `GALLERY` array — all 43 real photos, categorised to match the Products page filter taxonomy (vehicles/overlanding/canvas/furniture/covers/bags).
- **Workshop imagery**: `about.html` → the split image and craftsmanship detail grid.
- **Material showcase / Built By Full Throttle rail**: `index.html` → real material and project close-ups.
- **Close-Up Craftsmanship**: `work.html` replaces the earlier before/after slider concept — no genuine matching before/after pairs were supplied (only two different stock photos were being used to fake a transformation), so it was swapped for a real detail-shot grid instead. Add a genuine before/after pair later by restoring the `.ba-wrap`/`.ba-slider` markup (styles are still in `css/style.css`) with two photos of the *same* item.

**One product still uses a stock photo**: Motorcycle & ATV Seat Upholstery. The only supplied motorcycle photo was embedded in a marketing flyer with a design badge overlapping part of the seat, so it wasn't cleanly croppable — a real photo can be swapped in later at `js/main.js` (search "Motorcycle & ATV Seat Upholstery").

### Logo

The official logo (as supplied) lives at `assets/img/logo.jpg`, used unmodified in the nav, mobile menu, footer, homepage intro animation and browser-tab favicon on every page. Do not recolour, crop or redraw it — replace the file itself if a new version is supplied, keeping the same filename/paths.

## WhatsApp & contact configuration

The WhatsApp number is set once, in `js/main.js`:

```js
var WHATSAPP_NUMBER = "27660631757"; // 066 063 1757
```

WhatsApp and the phone number are the same number, per the brief. Every product card, the homepage configurator, the Contact page form, the floating WhatsApp button, and every `data-wa-message` button route through `FTWhatsApp()`, which opens `https://wa.me/27660631757?text=...` with a prefilled message.

Business info (address, email) is set directly in each page's contact/footer markup and in the JSON-LD `LocalBusiness` schema in `index.html`/`contact.html`:

- Address: 18B Liter Street, Industria, Middelburg, Mpumalanga, South Africa
- Call / WhatsApp: 066 063 1757
- Email: fullthrottle.gearandfitment@gmail.com

### Photo upload on the Contact form

Browsers cannot programmatically attach a file to a `wa.me` link — WhatsApp's URL scheme only supports prefilled text. The "Upload a Photo" field lets a visitor pick a reference photo; the form reminds them (on-screen and in the WhatsApp message) to attach it manually once the chat opens.

## Running locally

No build step required. From this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Structure

```
index.html      Home (hero, disciplines, Built By Full Throttle rail, why-choose-us, configurator, materials, stats, footer)
products.html   Products & Services (27-item catalogue, filterable: Vehicles/Overlanding/Canvas/Furniture/Covers/Bags/Custom)
work.html       Our Work (gallery + lightbox, Close-Up Craftsmanship detail grid)
builds.html     Custom Builds (5-step manufacturing process timeline)
about.html      The Workshop (craftsmanship story, no invented history/stats)
contact.html    Contact & Quote (detailed form → WhatsApp, map, contact details)
css/style.css   Full design system: palette, type, buttons, cards, nav, cursor, intro, view-transitions
js/main.js      Nav, WhatsApp logic, product/gallery data + rendering, configurator, intro, cursor, counters, forms
```

Product cards on `products.html` support a `?cat=` query param (e.g. `products.html?cat=vehicles`) so links from the homepage's discipline tiles and "Built By Full Throttle" rail land pre-filtered.

## Design system notes

- **Palette**: black/charcoal base with deep red, deep green and workshop yellow, each with a brighter "glow" variant used only in shadows/borders — flat industrial fills, glow reserved for accents and hover states.
- **Type**: Anton (display headlines), Inter (body copy), JetBrains Mono (nav, buttons, tags, labels — the "technical readout" layer).
- **Signature motif**: an animated stitch-line divider (dashed line + diamond end-marks) replaces the previous mountain-ridge motif as the site's recognisable detail.
- **Custom cursor**: desktop only (`hover:hover` + `pointer:fine`), shows contextual labels (View / Explore) on `[data-cursor]` elements; never applied on touch devices.
- **Page transitions**: uses the CSS View Transitions API (`@view-transition { navigation: auto; }`) with a seam-wipe clip-path animation. Supported in Chromium-based browsers; other browsers fall back to a normal page load with no error.
- **Stat counters** on the homepage use real, countable facts (27 products, 5 disciplines, 7 catalogue categories, 100% made-to-measure) — no fabricated customer counts, years-in-business or review numbers anywhere on the site, per the brief.

## Notes on the brief

- No window tinting is mentioned or offered anywhere on the site.
- No prices, customer counts, years-in-business, awards or certifications are stated anywhere — every product uses "Custom Quote" and copy avoids inventing company history.
- The old `catalogue.html` and `services.html` pages have been removed and replaced by `products.html` and `builds.html`.
