Scaffold a new component. Arguments: $ARGUMENTS
Expected format: `ComponentName desktop|mobile|shared|ui [--animated]`

---

## Steps

**1. Parse arguments**
- `ComponentName` — PascalCase, the component name
- Category — one of: `desktop`, `mobile`, `shared`, `ui`
- `--animated` flag (optional) — include Framer Motion boilerplate

**2. Resolve the target directory**
| Category | Path |
|---|---|
| `desktop` | `src/components/desktop/` |
| `mobile` | `src/components/mobile/` |
| `shared` | `src/components/shared/` |
| `ui` | `src/components/ui/` |

**3. Read the target directory** to understand existing patterns before writing.

**4. Create `ComponentName.tsx`** with:

```tsx
// No imports unless needed — import only what is used
import { motion } from "framer-motion"; // only if --animated

// Variants defined here, OUTSIDE the component — never inline in JSX
const variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

interface ComponentNameProps {
  // Define props with interface, never `type` for objects
}

export function ComponentName({ }: ComponentNameProps) {
  return (
    // spacing: multiples of 8px only — p-2(8), p-4(16), p-8(32), p-16(64)
    // colors: slate-950 (base), slate-900 (surface), sky-400 (accent), slate-50 (text)
    // fonts: font-mono for headings/data, font-sans for body
    <div className="bg-slate-900 p-4">
    </div>
  );
}
```

**Rules to enforce:**
- `desktop` components: no mobile logic, no `scroll-snap`, no `BottomNav` references
- `mobile` components: no hover-only states, no `BentoGrid` references
- All spacing on 8px grid — `p-2`, `p-4`, `p-8`, `p-16`, `gap-2`, `gap-4`, `gap-8`
- Colors strictly from palette — `slate-950`, `slate-900`, `sky-400`, `slate-50`
- No `any` in TypeScript
- Named export (not default export)
- Zero self-evident comments

**5. Report** the created file path and a one-line description of what it exports.
