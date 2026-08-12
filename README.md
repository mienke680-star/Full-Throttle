# Full Throttle Overlanding — Website

A 6-page static website (Home, Custom Catalogue, Services, Our Work, About, Contact) built for Full Throttle Overlanding, a South African custom automotive, overlanding and material-work specialist. Plain HTML/CSS/JS — no build step, no framework, no backend.

## ⚠️ Placeholder assets — action required before launch

This build was generated from a written brief. **No logo file and no real project photographs were actually attached to the session that built it.** To respect the brief's explicit instruction not to redesign or recreate the logo, the site currently ships with clearly-marked stand-ins instead of a fabricated version of the real thing:

- **Logo** — every page uses a plain text wordmark ("FULL THROTTLE OVERLANDING") inside a circular badge (see `.logo-badge` / `.nav-logo-mark` in `css/style.css`, used in each page's `<header class="site-nav">`, the mobile panel, the intro animation, and the footer). Swap this for the real logo file once you have it — see "Swapping in the real logo" below.
- **Photography** — the hero image, catalogue thumbnails, gallery, before/after and about-page images all use hotlinked Unsplash stock photos of generic 4x4/upholstery subjects (not Full Throttle's actual work). These are placeholders only and should be replaced with real completed-project photos — see "Swapping in real photos" below.
- **Intro animation vehicle** — the cinematic drive-by intro on the homepage uses a simple original SVG silhouette of a generic bakkie (not any specific real vehicle or brand), since no reference photography/video was supplied.

Everything else — layout, copy, WhatsApp flows, animations, filters, forms — is fully built and functional against these placeholders.

### Swapping in the real logo

1. Save the official logo file (PNG or SVG, transparent background ideally) into `assets/img/logo.png` (or `.svg`).
2. In every HTML page, replace:
   ```html
   <span class="logo-badge">FT</span>
   <span class="nav-logo-mark">FULL THROTTLE<span>OVERLANDING</span></span>
   ```
   with:
   ```html
   <img src="assets/img/logo.png" alt="Full Throttle Overlanding" style="height:44px;">
   ```
   in the nav (`header.site-nav`), the mobile panel isn't currently branded so no change needed there, and in `index.html`'s `#intro .intro-logo` block (replace the `.logo-badge` + `.nav-logo-mark` markup the same way, sized larger).
3. Do not recolour, redraw, or crop the logo file — use it as supplied.

### Swapping in real project photos

All image sources are centralised for easy replacement:

- **Home hero**: `index.html` → `.hero-media img`
- **Catalogue images**: `js/main.js` → the `CATALOGUE` array (`img` field per item)
- **Gallery images**: `js/main.js` → the `GALLERY` array (`src` field per item)
- **Before/After**: `work.html` → `.ba-wrap img` and `.ba-after img`
- **About page**: `about.html` → the two `<img>` tags

Replace each Unsplash URL with a path to a real photo (e.g. `assets/img/work/canopy-cover-01.jpg`). Group multiple photos of the same project together in the `GALLERY` array with matching `label` text, and use the real `cat` values (`4x4`, `covers`, `upholstery`, `motorcycles`, `custom`) so filtering keeps working.

## WhatsApp configuration

The WhatsApp number is set once, in `js/main.js`:

```js
var WHATSAPP_NUMBER = "27829079166"; // 082 907 9166
```

Every "Enquire on WhatsApp", "Get a Custom Quote", floating WhatsApp button, and the Contact page form all route through `FTWhatsApp()` / the `data-wa-message` attribute, which opens `https://wa.me/27829079166?text=...` with a prefilled message. Change the number in this one place to update it site-wide.

The Call number (`066 063 1757`) is set directly as `tel:+27660631757` links in each page's nav/footer/contact section.

### Photo upload on the Contact form

Browsers cannot programmatically attach a file to a `wa.me` link — WhatsApp's URL scheme only supports prefilled text. The "Upload a Photo" field on the Contact page lets a visitor pick a reference photo; the form then reminds them (on-screen and in the WhatsApp message) to attach that photo manually once the WhatsApp chat opens.

## Running locally

No build step required. From this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Structure

```
index.html        Home (incl. cinematic intro animation)
catalogue.html     Custom Catalogue (filterable, WhatsApp enquiry per item)
services.html      Custom Services (4-step process, services grid, motorcycle upholstery feature)
work.html          Our Work / Gallery (masonry + lightbox, before/after slider)
about.html         About (brand story, Your Idea. Our Craft.)
contact.html       Contact (form → WhatsApp, map, contact details)
css/style.css      All styling, brand palette, animations
js/main.js         Nav, WhatsApp logic, catalogue/gallery data + rendering, intro animation, forms
```

## Notes on the brief

- No window tinting is mentioned or offered anywhere on the site, per the brief.
- No prices, customer counts, years-in-business or review counts are stated anywhere — every product uses "Custom Quote" per the brief's instruction not to invent statistics.
- Brand palette follows the brief's final instruction: red, green, white and gold/yellow as the primary identity, with black/charcoal as a supporting background only.
