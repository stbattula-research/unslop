# DESIGN.md — The Anti-Slop Principles

Unslop exists because AI-generated websites have tells. Below are the twelve most common ones, and the principle each Unslop component follows instead. Contributors: a new component must break at least three of these tells on purpose.

## The twelve tells

1. **The purple-blue gradient background.** The single most reliable signal of an AI-built site. Gradients aren't evil, but the violet-to-indigo wash on everything is a default, not a decision.
   → *Principle: flat color with conviction.* One ink, one paper, one accent. A flat field of red or amber says more than any gradient.

2. **The centered pill-badge hero.** A small rounded pill ("✨ Introducing v2.0") centered above a centered headline above centered buttons.
   → *Principle: never center by default.* Left-align the hero. Let the kicker sit on a rule, not in a pill. Asymmetry is a point of view; centering is a shrug.

3. **Glassmorphism cards.** Frosted-glass panels with backdrop blur on every section, regardless of context.
   → *Principle: texture over translucency.* Paper grain, dotted textures, hairline rules, hard shadows. Depth from material, not from blur.

4. **The three identical feature cards.** Three rounded rectangles, three emoji-free lucide icons, three two-line descriptions, in a row.
   → *Principle: information has a genre.* Features can be a ledger, an index, a menu, a timetable. Pick the genre the content deserves — see the Ledger Features component.

5. **Star ratings and avatar circles on testimonials.** Five yellow stars, three circular headshots, three interchangeable quotes.
   → *Principle: quote like a book.* Pull-quotes, oversized quotation marks, blurb-style attribution. Nobody ever believed the five stars anyway.

6. **Copy that could be anyone's.** "Revolutionize your workflow." "Unlock the power of." "Seamless, intuitive, cutting-edge."
   → *Principle: microcopy with a voice.* Buttons say what they do ("Send the letter"). Footers admit what they are. Write like a person who has opinions.

7. **The pricing table with the glowing middle tier.** Three columns, the middle one scaled 105% with a gradient border and a "Most popular" badge.
   → *Principle: give pricing a setting.* A bistro menu, a fare table, a price list nailed to the wall. The featured tier gets a stamp, not a glow.

8. **Rounded-everything.** `rounded-2xl` on cards, buttons, inputs, badges — a site with no corners has no character.
   → *Principle: corners are a decision.* Sharp corners with hard offset shadows read as confident. Round only what should feel soft, and mean it.

9. **The generic dark section sandwich.** Light hero, dark features band, light testimonials, dark CTA — alternating bands with no reason.
   → *Principle: one paper, used well.* Stay on one background and let type, rules, and spacing do the work. Go dark only when the component's genre demands it (a colophon, a poster).

10. **Icons as decoration.** A grid of thin-stroke icons that communicate nothing the label doesn't already say.
    → *Principle: typography is the ornament.* A giant serif numeral, a mono index, a rotated stamp — set in type, not drawn in strokes.

11. **The footer link farm.** Four columns of "Product / Company / Resources / Legal" with twenty links nobody clicks.
    → *Principle: end like a book ends.* A colophon: what this is set in, who made it, and a sign-off. Three honest columns beat twelve filler ones.

12. **Motion for motion's sake.** Everything fades up on scroll, staggered, with the same easing — the site performs enthusiasm it doesn't feel.
    → *Principle: stillness is a design choice.* Unslop components are static by default. Animate one thing, on interaction, or animate nothing.

## The house style, in one paragraph

Editorial typography (serif display, grotesk body, mono labels), restrained palettes (ink, paper, one accent), generous whitespace, and layouts that pick a genre — masthead, ledger, menu, letter, poster, colophon. If a component could be mistaken for a template, it doesn't ship.
