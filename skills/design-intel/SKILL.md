---
name: design-intel
description: Think like a senior designer before touching code. Use when making visual design decisions for an Unslop project — typography scale, spacing rhythm, color discipline, layout genre, copy voice — or when reviewing a design for AI clichés. Codifies the DESIGN.md principles as executable rules with a self-critique pass.
---

# design-intel — senior-designer judgment, as rules you can run

You are an agent about to make visual choices. These rules are the difference between a design that looks considered and one that looks generated. Read DESIGN.md once, then work through the sections below *before* writing any markup. Default: make the smallest number of decisions that produce a complete look. A design is done when every element earns its place — not when you run out of ideas.

## 1. Typography

**Scale discipline.** Pick a type scale and obey it. One scale per project: `1rem` body, then multiply by 1.25 (minor third) or 1.5 (perfect fifth) — never both, never ad hoc sizes. Most sites need exactly four text sizes: display, section head, body, label. If you need a fifth, something is off.

**Pairing rules.** Two families maximum, three roles maximum:
- *Display* (the voice): a serif with opinions — Fraunces, Newsreader, EB Garamond. Characterful enough to be recognized from across the room.
- *Body* (the workhorse): a grotesk — Inter, Archivo, Söhne-like stacks. Boring on purpose. It should disappear.
- *Label* (the annotation): a mono — for captions, index numbers, kickers. The mono is what makes the editorial trick work.

Never pair two serifs. Never pair two "characterful" families — one lead actor, one stagehand.

**Measure.** Body text: 45–75 characters per line. Hit this with `max-width: 65ch` on prose, not by eyeballing. Anything wider reads as lazy; anything narrower reads as precious.

**Hierarchy is one mechanism.** Pick ONE way to signal importance — size OR weight OR color — and keep the other two constant. If headings are bigger *and* bolder *and* a different color, you don't have hierarchy, you have panic.

## 2. Spacing

**Whitespace is the primary tool.** Before adding a border, background, or shadow, try removing things. A section reads as premium when the eye has somewhere to rest.

**Rhythm.** One spacing unit (e.g. 8px or 0.5rem), multiplied — `4/8/16/32/64/96`. If a value isn't on the ladder, justify it out loud before using it. Margins between sections should be roughly double the margin between elements within a section.

**Density matches the genre.** A ledger is dense (information earns the tightness). A letter is airy. A poster is one message and nothing else. Don't put poster-sized whitespace around ledger-dense content — the genre picks the density, not your mood.

## 3. Color

**Ink, paper, one accent.** Two neutrals (a near-black ink, an off-white paper) plus ONE accent used sparingly — under 10% of pixels. The accent appears where attention goes: the CTA, the one key number, the stamp. If the accent is everywhere, it's not an accent.

**Flat color with conviction.** A field of flat red or amber says more than any gradient (DESIGN.md tell #1). If you feel the urge to add a gradient, ask what insecurity it's covering. Answer the insecurity with better type instead.

**When texture, not color.** Depth comes from material: paper grain (subtle SVG noise), dotted patterns, hairline rules, hard offset shadows. Blur is not depth — never use backdrop-blur panels to fake it.

## 4. Layout

**Pick a genre first.** Before any div, name the genre: masthead, ledger, menu, letter, poster, colophon. Then borrow that genre's conventions shamelessly (menus have dotted leaders; ledgers have hairlines and index numbers; letters have salutations). Genre is how information gets character.

**Asymmetry by default.** Left-align heroes. Offset the columns. Let one element break the grid on purpose. Centering is a shrug — a centered layout says you had no opinion (DESIGN.md tell #2).

**The one-paper rule.** One background color for the whole page. Change the background only when the genre demands it (a poster section, a colophon footer) — and even then, change the *paper*, not to dark-mode-by-default. Alternating light/dark bands with no reason is tell #9.

**One ornamental move per page.** A rotated stamp, an oversized numeral, a margin note — pick ONE. Two ornaments argue; three make noise. The ornament should be set in type (a giant serif numeral, a mono index), not drawn as decoration.

## 5. Copy voice

**Write like a person with opinions.** Buttons say what they do ("Send the letter", not "Submit"). Headlines make claims, not vibes ("Built for people who invoice" beats "Revolutionize your workflow"). Never write: revolutionize, unlock, seamless, cutting-edge, elevate, supercharge, delights.

**Specificity is the voice.** "Ships in 2 days" beats "fast". "Three plans, cancel by email" beats "flexible". If a line could belong to any product, delete it and write one that couldn't.

**Footers admit what they are.** A colophon: what this is set in, who made it, a sign-off. Nobody believes your twelve link columns.

## 6. The design review — run this on your own output

Before shipping, answer every question yes-or-no. One "no" = fix before committing.

1. Does the page break at least three DESIGN.md tells *on purpose*?
2. Can you name the genre of each section in one word?
3. Is the background one paper, with any dark section justified by genre?
4. Are there exactly two type families (three roles max)?
5. Does every text size sit on the chosen scale ladder?
6. Is body copy within 45–75 characters per line?
7. Is hierarchy signaled by ONE mechanism (size, weight, or color)?
8. Is every spacing value on the rhythm ladder?
9. Is the accent color used in under 10% of the surface?
10. Is there zero backdrop-blur, zero gradient, zero bouncy easing?
11. Is the hero left-aligned (or centered for a stated, defensible reason)?
12. Is there exactly one ornamental move, set in type?
13. Does no line of copy work for a competitor's product?
14. Does the footer read as a colophon, not a link farm?
15. Would a designer defend every deviation out loud without hedging?

If you can't defend a choice in one sentence, it isn't a choice — remove it.
