# React Lab

## Platform priority

This project is built for desktop first. Mobile must still work, but it has a lower priority.

- **Design and test on desktop first.** Desktop sets the layout, the density, and the interaction model.
- **Keep every page responsive.** Content must fit, scroll, and stay usable on a phone. Nothing can overflow or break.
- **Do not build mobile-only variants.** Do not add a second component tree, a mobile-only flow, or `useIsMobile()` branches for a better phone experience. Use responsive CSS on the same component.
- **Accept a simpler mobile result.** A dense table or a wide menu that is usable on a phone is enough. Do not trade desktop quality for mobile polish.

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
- **Add a token when you need a new shade.** Define it in `app/css/components.css` with `color-mix`, for light and dark, and map it in `@theme inline`. See `--button-ghost-hover`.
- **Use `opacity-*` on the element only when the whole element must fade.** It also fades the text and the children.

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
