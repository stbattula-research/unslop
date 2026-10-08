---
name: prompt-shaper
description: Turn a vague build request into a sharp Unslop-aware brief. Use when the user asks to sharpen, rewrite, or improve a prompt, says "help me write a brief", or hands you a handwave like "build me a landing page". Extracts intent, asks max 3 questions, matches Unslop components, and emits a build brief with DESIGN.md constraints and stop conditions.
---

# prompt-shaper — vague request in, sharp build brief out

Most prompts waste credits because they ask the agent to guess: guess the stack, guess the design, guess when to stop. Your job is to remove the guessing. Feed every request through the seven steps below. When a step finds nothing to change, say so in one line and move on — the skill is sharp, not long-winded.

## 1. Detect target tool and output type

State both explicitly at the top of the brief. Common cases:

- **AI coding agent** (Claude Code, Cursor, Windsurf) → output is a build task: files, stack, commands.
- **Image model** → output is a visual spec: composition, style, what to avoid.
- **Chat assistant** → output is an answer: depth, format, audience.

If the tool is genuinely ambiguous ("make me a logo" could be an image model or a designer agent), that is clarifying-question #1 — don't pick for them.

## 2. Extract intent dimensions

Pull these from the request. Write each as one line; mark missing ones MISSING — the gaps are what steps 3 and 5 fix.

- **Task:** the verb. What should exist afterward that doesn't now?
- **Inputs:** what the agent gets (brand, copy, data, screenshots, links).
- **Outputs:** the concrete deliverables (files, pages, formats).
- **Constraints:** stack, budget, deadlines, things explicitly forbidden.
- **Context:** what this is for — product, audience, where it ships.
- **Audience:** who uses or reads the result. "Users" is not an audience; "freelance accountants invoicing on phones" is.
- **Success criteria:** how the user will judge it. Measurable or it's not a criterion.
- **Stop conditions:** when the agent must stop and hand back control (scope reached, question unanswered, third-party approval needed).

## 3. Ask at most 3 clarifying questions

Only when a missing dimension would change the build. Offer a good default answer with each question so the user can just say "yes":

> **Q1 (stack):** React+Tailwind or plain HTML/CSS? Default: React+Tailwind if their project already uses it.

Never ask what you can reasonably infer. Never ask more than three — if four things are unclear, pick defaults for the least consequential and note the assumption in the brief.

## 4. Match against the Unslop registry

Check `registry.json` against the request's intent dimensions:

- Name the specific components that fit, with one-line reasons.
- **When nothing fits, say so plainly** — never stretch a component to cover a gap. "No registry component covers an interactive dashboard; build it in the Unslop style from DESIGN.md instead."
- If the request is too vague to match anything (this is why you're here), name that: "too vague to route — that's what this brief fixes."

## 5. Bake in DESIGN.md constraints

Every brief carries the anti-slop rules as prohibitions, not suggestions:

- Flat color with conviction: one ink, one paper, one accent. No purple/blue gradients, no glassmorphism.
- Never center by default; asymmetry is a point of view.
- Genre-pick every layout (masthead, ledger, menu, letter, poster, colophon) before building.
- Corners are a decision; hard shadows stay hard.
- Motion: animate one thing on interaction, or nothing (see MOTION.md).
- Microcopy with a voice — no "revolutionize / unlock / seamless / cutting-edge".

## 6. Emit the brief

One page, this template, filled in:

```markdown
# Build brief: <one-line goal>

## Goal
<what exists afterward, in one sentence>

## Components to use
- <registry name> — <why this one>

## Files to touch
- <path or "new file: <path>"> — <what changes>

## Design tokens
- Ink / paper / accent: <values or "component defaults">
- Type: <display / body / label pairing>
- Genre: <masthead | ledger | menu | letter | poster | colophon>

## Acceptance checklist
- [ ] <observable, testable outcome>
- [ ] <breaks ≥3 DESIGN.md tells on purpose>
- [ ] <passes the design-intel review (skills/design-intel)>

## Stop conditions
- <when to stop and report back>

## Anti-slop prohibitions
- <the specific clichés this build must not contain>
```

The acceptance checklist is the contract. If the user can't check a box by looking, rewrite the box.

## 7. Token-efficiency audit

Score the *original* request against the credit-killing patterns. Report the hits in two lines, then show the brief as the fix. Adapted to web builds:

1. **Vague verbs** — "make", "build", "do", "handle" with no object. Fix: name the deliverable.
2. **No success criteria** — nothing says what "done" looks like. Fix: acceptance checklist.
3. **Unlocked scope** — "and maybe also…" with no boundary. Fix: files-to-touch list; everything else is out of scope.
4. **No stop conditions** — the agent can iterate forever. Fix: explicit stop.
5. **Handwaves** — "make it modern", "clean", "professional", "nice". Fix: genre + tokens + prohibitions.
6. **Missing inputs** — the agent will invent your brand, copy, and data. Fix: inputs section; inventing is forbidden unless the brief allows it.
7. **Stack ambiguity** — React? HTML? "Whatever works"? Fix: detect and state.
8. **No audience** — designed for everyone, fits no one. Fix: one named audience.
9. **Invisible constraints** — "should be fast", "must be accessible" with no numbers. Fix: numbers or it's not a constraint.

Close the audit with: "Credits this brief saves: one guess-free build pass, zero restyle rounds."
