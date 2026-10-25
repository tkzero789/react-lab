/* Platform check for keyboard shortcut labels */

import * as React from "react"

function subscribe() {
  return () => {}
}

/* The server cannot know the platform. It renders Ctrl, and the client swaps in ⌘ after hydration. */
export function useIsMac() {
  return React.useSyncExternalStore(
    subscribe,
    () => /Mac|iPhone|iPad/.test(navigator.userAgent),
    () => false
  )
}
