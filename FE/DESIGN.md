# Pets Shop UI Design System (DESIGN.md)

This file integrates principles from **taste-skill**, **awesome-design-md**, **Vercel Web Interface Guidelines**, and **playwright-cli** to ensure a premium, beautiful, and accessible frontend for the Pets Shop.

## 1. Visual Theme & Atmosphere (Taste-Skill Anti-Slop)
- **Vibe:** Clean, premium e-commerce. Not a generic dashboard.
- **Dials:** DESIGN_VARIANCE: 6 | MOTION_INTENSITY: 5 | VISUAL_DENSITY: 4
- **Anti-Slop:** 
  - NO default purple gradients. 
  - NO centered hero sections with 3 symmetrical cards below it. 
  - NO em-dashes as design elements.
  - Pick a single accent color (e.g., deep terracotta, forest green, or cobalt blue) and stick to it.
  - Avoid beige/cream backgrounds paired with brown/oxblood text (the generic premium-consumer default). Use crisp contrast.

## 2. Typography & Layout (Taste-Skill & Vercel Guidelines)
- **Sans-Serif Default:** Use `Geist`, `Inter`, or `Outfit`. Do not use Serifs unless explicitly requested.
- **Typographic Details:** 
  - Use `…` (ellipsis character), not three dots `...`.
  - Use curly quotes `“ ”`.
  - Disable spellcheck on inputs like emails or usernames.
- **Hero Sections:** Max 2 lines for the headline. Subtext max 20 words. CTAs must be visible without scrolling.
- **Bento Grids:** Must have rhythm and asymmetry. Do not stack 6 identical cards.

## 3. Accessibility & UX (Vercel Guidelines)
- **Focus States:** Every interactive element needs a visible focus (`focus-visible:ring-2`). Never use `outline-none` without an alternative.
- **Forms:**
  - Labels must be clickable (wrap input or use `htmlFor`).
  - Async updates need `aria-live="polite"`.
  - Show errors inline next to fields.
- **Images:** Always include explicit `width` and `height`. Use `alt` tags (`alt=""` for decorative). Critical above-fold images get `fetchpriority="high"`.
- **Buttons:** Icon-only buttons MUST have `aria-label`. Use `<button>` for actions, `<a>` or `<Link>` for navigation.

## 4. Animation & Motion
- **Performance:** Animate `transform` and `opacity` only. Never animate `width` or `height` directly.
- **Accessibility:** Always honor `prefers-reduced-motion`.
- **Taste:** Ensure motion is motivated. Avoid infinite bouncy loops on cards unless necessary.

## 5. UI Verification (Playwright CLI)
To ensure the UI matches the design and accessibility guidelines, use `playwright-cli` for visual and functional testing:
- **Test interactively:** `playwright-cli open http://localhost:5173 --headed`
- **Verify Accessibility & Layout:** Use `playwright-cli snapshot` to capture the DOM tree and assert correct structure and ARIA labels.
- **Visual Tests:** Use `playwright-cli screenshot --hires` to verify the typography, spacing, and accent colors match this DESIGN.md.

---

> **Agent Instruction:** When modifying the UI in this project, read this file first. Generate layouts that adhere to these principles. When complete, use playwright-cli to verify the focus states and accessibility markup.
