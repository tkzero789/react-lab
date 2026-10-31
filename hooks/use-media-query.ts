/* Subscription to a CSS media query */

import * as React from "react"

/* These values match the Tailwind breakpoints of the same name */
export const MIN_WIDTH = {
  md: "(min-width: 48rem)",
  xl: "(min-width: 80rem)",
} as const

/* The server cannot know the window size. It renders the desktop result because desktop sets the layout. */
export function useMediaQuery(query: string) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    [query]
  )

  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => true
  )
}
