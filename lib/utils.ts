import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ContentSegment =
  | { type: "text"; content: string }
  | { type: "link"; content: string; href: string }

const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi
const TRAILING_PUNCTUATION = /[.,;:!?)\]]+$/

export function parseLinks(text: string): ContentSegment[] {
  const segments: ContentSegment[] = []
  let lastIndex = 0

  for (const match of text.matchAll(URL_REGEX)) {
    const raw = match[0]
    const start = match.index

    const trailing = raw.match(TRAILING_PUNCTUATION)?.[0] ?? ""
    const url = trailing ? raw.slice(0, -trailing.length) : raw

    if (start > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, start) })
    }

    segments.push({
      type: "link",
      content: url,
      href: url.startsWith("www.") ? `https://${url}` : url,
    })

    if (trailing) {
      segments.push({ type: "text", content: trailing })
    }

    lastIndex = start + raw.length
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) })
  }

  return segments
}
