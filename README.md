# Luke's Renovations — 2050 Redesign (Home page)

Front-end pitch demo. React + Vite + Tailwind + Framer Motion + three.js.
No backend — the quote form and newsletter fake their success states.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Other targets:

```bash
npm run build      # dist/ — serve with `npx serve dist`
npm run build:solo # dist-solo/index.html — ONE file, opens by double-click
```

`build:solo` inlines the JS, CSS and every image as base64 into a single
~2.9 MB HTML file. Handy for emailing the client a demo with nothing to install.
Fonts still come from Google Fonts, so it falls back to system faces offline.

---

## What's real vs. shell

Only **Home** is built. Every other nav item renders but is disabled, dimmed,
`cursor: not-allowed`, with a "Coming soon" tooltip. "View Full Portfolio" is
likewise a visual dead end. Nothing routes.

---

## Structure

```
src/
  lib/
    content.js     ← ALL copy, reviews, project titles. Edit here, not in JSX.
    images.js      ← asset imports + srcset/LQIP wiring
    imageMeta.js   ← generated: intrinsic sizes + blur-up placeholders
    hooks.js       ← media queries, scroll lock, rAF scroll, in-view
    confetti.js    ← ~60-line canvas burst, instead of a dependency
  ui/              ← primitives: Button, Img, Motion, Icons, Cursor, Atmosphere
  components/      ← one file per page section, in page order
```

`content.js` is the file to hand a copywriter. No prose lives in components.

---

## The three pieces worth reading

**`components/BeforeAfter.jsx`** — the drag slider. The *after* photo is the
base layer; the *before* sits on top clipped with `clip-path: inset()`. During
a drag the position is written straight to the DOM as a CSS value, never
through React state, so dragging causes zero re-renders. The container is
`touch-action: pan-y`, which hands vertical gestures back to the browser for
normal page scrolling while keeping horizontal ones — that's what stops the
slider trapping a scrolling thumb on mobile. Arrow keys / Home / End work, and
there's a one-time auto-nudge on first view to signal it's draggable.

**`components/ThreeScroll.jsx`** — the scroll-scrubbed 3D scene. A bathroom
assembles itself from cyan wireframes into solid geometry as you scroll. Parts
are declared as a data table (`PARTS`) with a from-position, a to-position and a
scroll offset, ordered the way a real bathroom gets built: slab, walls, then
fit-off. three.js is code-split and dynamically imported, DPR is capped at 1.75,
and an IntersectionObserver stops the render loop entirely when the canvas is
off-screen. If WebGL is unavailable it falls back to a CSS-3D version driven by
the same scroll value.

**`components/QuoteWizard.jsx`** — 4 steps, validated (you can't advance
without a selection), Back navigation, real radio semantics under the custom
cards, `aria-live` errors, and a canvas confetti burst on submit. Uploaded
photos never leave the browser.

---

## Images

Nine photos were supplied. Placement:

| File (original) | Used as |
| --- | --- |
| `image2.jpg` | Hero background |
| `kitchens.jpeg` | Full Design & Renovation split |
| `Project1 before/after` | Slider 1 — Inner Sydney Family Bathroom |
| `project2before/after` | Slider 2 — Apartment Bathroom Rebuild |
| `project 3 before/after` | Slider 3 — Ensuite Shower Upgrade |
| `image2159.jpg` | Gallery + Instagram strip |
| `Logo.png` | Navbar / footer |

Two notes:

- **`logo-light.png` is generated**, not supplied. The original wordmark is mid
  grey and vanished against the dark nav, so a script lifted the neutral pixels
  to white while leaving the teal house mark untouched. The original is still
  exported as `LOGO` if you need it on light backgrounds.
- **Before/after pairs have mismatched aspect ratios** (project 1's before is
  portrait, its after is landscape). The slider pins both layers inside one
  16:11 crop box so they wipe cleanly against each other.

### No team photo was supplied

Section 4.8 is fully built with a designed 4:5 slot rather than a broken frame.
To drop in the real photo:

1. Save it to `src/assets/images/team.jpg`
2. Add it to `src/lib/images.js` alongside the others
3. Pass it through: `<MeetLuke teamImage={IMG.team} />` in `App.jsx`

The frame, parallax, hover caption and stat row all stay as they are.

### Regenerating image metadata

If you add or swap photos, regenerate the blur-up placeholders — see the script
comment at the top of `src/lib/imageMeta.js`.

---

## Performance & accessibility

- Everything animated is `transform`/`opacity`. No animated layout properties.
- Scroll listeners are rAF-throttled; there's one shared scroll subscription.
- three.js loads only when its section approaches the viewport.
- LQIP + intrinsic `width`/`height` on every image → no cumulative layout shift.
- `prefers-reduced-motion` is respected globally *and* per-component: the
  drag-hint nudge, confetti, parallax and 3D scrub all opt out individually
  rather than just being frozen by the CSS override.
- Visible focus ring on every interactive element; the custom cursor is
  additive and only mounts for fine pointers.
- The before/after handle is a real `role="slider"` with keyboard support.

---

## Known gaps

- Google Fonts loads from CDN. Self-host `Space Grotesk`, `Inter` and
  `JetBrains Mono` before going live if you want offline parity.
- Reviews are hard-coded in `content.js`, not pulled from the Google Places API.
- No analytics, no form endpoint, no meta/OG image — all out of scope for the demo.
