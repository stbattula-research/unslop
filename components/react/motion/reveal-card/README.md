# Reveal Card

A motion example, not a catalog component. It exists to demonstrate the [MOTION.md](../../../../MOTION.md) one-motion rule in code.

**The rule, applied:** one card, one animated element, hover-triggered. The mono index arrow stamps in from the left on hover with a snappy spring (`stiffness: 420, damping: 34` — no overshoot, lands like a rubber stamp). The serif title, ruled body, and hard offset shadow never move.

```tsx
import { RevealCard } from "./RevealCard";

<RevealCard
  index="01"
  title="The quarterly ledger"
  body="Every transaction, numbered and ruled. Nothing hides in a hover state."
  href="/ledger"
/>
```

**Needs:** `npm install framer-motion` (declared dependency of this example only — base Unslop components stay dependency-free).

**Reduced motion:** `useReducedMotion()` disables the arrow animation for users who request it.
