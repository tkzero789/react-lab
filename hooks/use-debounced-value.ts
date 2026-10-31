"use client"

/* Return a value that changes only after it stays the same for the delay */

import React from "react"

export function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
