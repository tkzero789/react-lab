# React Lab

The desktop client of React Lab. The mobile client is the Android app in `../react-lab-expo`. Both clients use the Convex backend in this repo and share the same data.

## Platform priority

This web app is optimized for desktop use only. Phone users use the Expo app. The web app stays responsive, but it does not get a phone-optimized UI or UX.

- **Design and test on desktop.** Design for a mouse, a keyboard, and a wide window. Desktop sets the layout, the density, and the interaction model.
- **Use desktop patterns where they help.** Examples are multi-column layouts, side panels, dense lists and tables, context menus, tooltips, and keyboard shortcuts.
- **Make every main task work from the keyboard.** Enter submits, Escape closes, and focus is always visible.
- **Do not hide an action behind hover only.** Hover can reveal an action, but keyboard focus must reveal it too.
- **Keep every page responsive.** In a narrow window, on a tablet, or on a phone, content must fit, scroll, and stay usable. Nothing can overflow or break.
- **Accept a simpler result on small screens.** A dense table or a wide menu that is usable on a phone is enough. Do not trade desktop quality for mobile polish.
- **Do not build mobile-only variants.** Do not add a second component tree, a mobile-only flow, or `useIsMobile()` branches for a better phone experience. Use responsive CSS on the same component.
- **Match features with the Expo app, not layouts.** A feature on both clients keeps the same data and behavior. Each client designs its own UI for its own platform. See `../react-lab-expo/AGENTS.md`.

## Overlays

Use the same overlay on all screen sizes. This follows the platform priority. Do not swap a `Dialog`, `Popover`, `DropdownMenu`, or `Select` for a `Drawer` or `NativeSelect` on mobile.

### Multi-step flows

- **Do not stack overlays.** One flow uses one `Dialog`. Only an `AlertDialog` can open on top of it.
- **Show each step inside the same overlay.** Keep the step in state, change the header title, and show a back button after the first step.
- **Animate steps with `StepTransition`** from `app/apps/workout/components/step-transition.tsx`. It slides by direction. Give the `Dialog` a fixed height and set `fill`, so the dialog does not resize between steps.
- **Reset the step in `onOpenChangeComplete`,** not in `onOpenChange`. The reset then happens after the close animation.
- **Wrap the overlay in `<MotionConfig reducedMotion="user">`** so that the system reduced-motion setting applies.
- See `app/apps/workout/components/day-details.tsx`.

### Alert dialog

- **Use `AlertDialog` for a destructive confirmation.** It needs a clear decision.
- **Render the `AlertDialog` inside the overlay content** when the action starts from a `Dialog`. Base UI then treats it as a nested dialog. See the delete step in `app/apps/workout/components/day-details.tsx`.

## Styling

### Color tokens

- **Use only defined color tokens** for every color utility (`bg-`, `text-`, `border-`, `ring-`, `outline-`, `fill-`, `stroke-`, `divide-`, `shadow-`). Examples: `bg-muted`, `bg-button-ghost-hover`, `text-muted-foreground`, or `bg-(--token)` for a CSS variable.
- **Do not use an opacity modifier** on a color, such as `bg-muted/30` or `ring-ring/50`.
- **Do not use arbitrary color values,** such as `bg-[#f4f4f5]` or `bg-[oklch(...)]`.
- **Add a token when you need a new shade.** Define it with `color-mix`, for light and dark, and map it in `@theme inline`. See `--button-ghost-hover`.
- **Put each style in the correct CSS file** in `app/css`:
  - `globals.css` holds the global tokens.
  - `components.css` holds the tokens and styles for shared UI components.
  - `app.css` holds the tokens and styles for one app, such as `--panel`.
  - `animation.css` holds every animation class, global or app-specific.
  - `react-big-calendar.css` holds only the library styles. Do not mix it with other CSS.
- **Use `opacity-*` on the element only when the whole element must fade.** It also fades the text and the children.

### Radius

- **Use only `rounded-none`, `rounded-xs`, `rounded-sm`, `rounded-md`, and `rounded-full`.** Side and corner variants follow the same scale, such as `rounded-t-md`. `globals.css` does not define `--radius-lg`, so `rounded-lg` does not exist.
- **`rounded-md` is the default** for surfaces and controls: cards, dialogs, popovers, menu panels, buttons, toggles, toggle groups, inputs, selects, and sidebar items.
- **`rounded-full` is for round shapes:** tabs, avatars, switches, sliders, radios, progress bars, and pills.
- **`rounded-sm` is for tooltips and for items inside a menu panel.** An inner radius is the outer radius minus the padding. A `rounded-md` panel with `p-1` gives `rounded-sm` items.
- **`rounded-xs` is for small inline marks:** badges, `Kbd`, `code`, checkboxes, and chips.
- **`rounded-none` is for joined edges,** such as the inner sides of a group or a range.
- **Do not use bare `rounded` or arbitrary values,** such as `rounded-[10px]`. `rounded-[inherit]` and `rounded-(--cell-radius)` are allowed because they pass a scale value through.

### Hover and press feedback

- **Give every hover color the same active color.** Write `hover:bg-button-ghost-hover active:bg-button-ghost-hover`. Tailwind applies `hover:` only on devices that can hover, so a touch screen gets no feedback without `active:`.
- **Do the same for group variants.** Pair `group-hover:` with `group-active:`.
- **Add `pressable` to pressable elements** for the press scale. It is defined in `app/css/animation.css`.

### Report violations

- **Do not fix violations silently** in code outside the task.
- **List each violation at the end of the task,** with the file, the line, and the class. Fix it only when the user agrees.

## Code comments

When writing or editing code:

- **File header is the one "what" comment.** The first comment in a file describes what the file is for. Example: `/* User profile settings form */`
- **Every other comment explains "why," never "what" or "how."** Comment sparingly: only when the implementation reason is crucial and non-obvious. The code itself should show what it does and how.
- **Always use block syntax `/* ... */`.** Never use `//` line comments.
- **Keep it plain.** No decorative characters, banners, long horizontal lines, or dash separators. Example: `/* Comment */`
- **Write in ASD-STE100 (Simplified Technical English) style.** Short sentences (max ~20 words), one idea per sentence, active voice, simple present tense, plain approved words (use "use" not "utilize", "do not" not "don't"). Use software engineering terms and technical names (API, cache, request ID, rate limit) when no simple word says it precisely.
- **Punctuation: one sentence gets no period; two or more sentences end every sentence with a period.** Examples: `/* Sort in code because the API does not support ordering */` and `/* The API rejects a request above 100 items. Send the list in batches. */`
- **No history, dates, or counts that go stale.** Git records history. A comment states the current constraint only.
