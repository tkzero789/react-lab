/* Parse and format money that the app stores as integer cents */

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
})

const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/

export function formatCents(cents: number) {
  return currency.format(cents / 100)
}

export function formatCompactCents(cents: number) {
  return compactCurrency.format(cents / 100)
}

/* Returns null for text that is not a positive amount with at most two decimals */
export function parseCents(text: string) {
  const normalized = text.trim().replace(/,/g, "")
  if (!AMOUNT_PATTERN.test(normalized)) return null
  /* Round because 0.29 * 100 is 28.999999999999996 in floating point */
  const cents = Math.round(Number(normalized) * 100)
  return cents > 0 ? cents : null
}

export function centsToText(cents: number) {
  return (cents / 100).toFixed(2)
}
