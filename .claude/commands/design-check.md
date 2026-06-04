Audit the portfolio codebase for design system compliance. Run each check in order and report all violations grouped by category with file path and line number.

---

## 1. 8px Grid violations

Search all `.tsx` and `.ts` files in `src/` for Tailwind spacing classes that are NOT multiples of 2 (i.e. not on the 8px grid). Forbidden classes:

`p-3`, `p-5`, `p-6`, `p-7`, `px-3`, `px-5`, `px-6`, `py-3`, `py-5`, `py-6`,
`m-3`, `m-5`, `m-6`, `m-7`, `mx-3`, `mx-5`, `my-3`, `my-5`,
`mt-3`, `mt-5`, `mt-6`, `mb-3`, `mb-5`, `mb-6`,
`gap-3`, `gap-5`, `gap-6`, `gap-7`,
`space-x-3`, `space-x-5`, `space-y-3`, `space-y-5`,
`w-3`, `h-3` (only when used as layout spacing, not icon sizes)

## 2. Color palette violations

Only these colors are allowed:
- Background: `slate-950`
- Surface: `slate-900`
- Accent: `sky-400`
- Text: `slate-50`

Flag: any arbitrary color values `[#...]`, any other named color (`blue-`, `gray-`, `zinc-`, `neutral-`, `red-`, etc.), any hardcoded hex in `style=` props.

## 3. Two Adventures architecture violations

- Verify no file in `src/components/desktop/` imports from `src/components/mobile/` or contains mobile-specific logic (`useScrollSnap`, `scroll-snap`, `BottomNav`).
- Verify no file in `src/components/mobile/` imports from `src/components/desktop/` or contains desktop-specific logic (`BentoGrid`, hover-only states).
- Flag any component that handles both breakpoints with `hidden lg:block` / `block lg:hidden` — that's responsive design, not Two Adventures.

## 4. Framer Motion variants

Search for animation variants or `animate=` / `initial=` / `transition=` props defined **inline inside JSX** (as object literals directly in the prop). All variants must be defined as `const` above the component function. Flag any inline object like `animate={{ opacity: 1 }}` that isn't referencing a named variant.

## 5. TypeScript `any`

Search for `: any`, `as any`, `<any>`, `Array<any>` in all `.ts` and `.tsx` files. Zero tolerance.

## 6. Run lint

Run `npm run lint` from the project root and report any errors or warnings.

---

Summarize: total violation count per category. If clean, say so explicitly.
