/* Read the design tokens from the CSS files in app/css */
import fs from "node:fs"
import path from "node:path"

const CSS_DIR = path.join(process.cwd(), "app/css")
const TAILWIND_THEME = path.join(
  process.cwd(),
  "node_modules/tailwindcss/theme.css"
)

const COMMENT = /\/\*[\s\S]*?\*\//g
/* Token blocks hold no nested rules, so a flat brace match is enough */
const TOKEN_BLOCK =
  /(:root(?:\s*,\s*\.light)?|\.dark|@theme inline)\s*\{([^{}]*)\}/g
const DECLARATION = /--([\w-]+)\s*:\s*([^;]+);/g
const VAR_REFERENCE = /^var\(--([\w-]+)\)$/
const ANY_VAR_REFERENCE = /var\(--([\w-]+)\)/g
const LENGTH_TERM = /([+-])?\s*(\d*\.?\d+)(px|rem)/g
const MULTIPLY = /^(.+?)\s*\*\s*(\d*\.?\d+)$/
const NAMESPACE_RESET = /--([\w-]+)-\*\s*:\s*initial\s*;/g
/* A palette color has a plain name such as onyx or granite-200 and a literal color value */
const PALETTE_NAME = /^([a-z]+)(?:-(\d+))?$/
const COLOR_LITERAL =
  /^(?:oklch|oklab|lab|lch|rgb|rgba|hsl|hsla|hwb|color)\(|^#/

/* The CSS does not change the root font size, so the browser default applies */
const ROOT_FONT_SIZE = 16

export type ThemeToken = {
  name: string
  value: string
  light?: string
  dark?: string
}

export type RadiusToken = {
  name: string
  value: string
  source: "project" | "tailwind"
  px?: number
  rem?: number
}

export type PaletteFamily = {
  name: string
  colors: { name: string; step?: string; value: string }[]
}

export type RawToken = {
  name: string
  light?: string
  dark?: string
}

export type DesignTokens = {
  files: string[]
  palette: PaletteFamily[]
  colors: ThemeToken[]
  fonts: ThemeToken[]
  radius: RadiusToken[]
  shadows: ThemeToken[]
  other: RawToken[]
}

function parseDeclarations(body: string, target: Map<string, string>) {
  for (const [, name, value] of body.matchAll(DECLARATION)) {
    target.set(name, value.replace(/\s+/g, " ").trim())
  }
}

/* Tailwind nests @keyframes in its theme block, so count braces to find the end */
function readBlock(css: string, opener: string): string {
  const start = css.indexOf(opener)
  if (start === -1) return ""

  const bodyStart = start + opener.length
  let depth = 1
  for (let index = bodyStart; index < css.length; index++) {
    if (css[index] === "{") depth++
    if (css[index] === "}") depth--
    if (depth === 0) return css.slice(bodyStart, index)
  }
  return ""
}

function readTailwindDefaults(): Map<string, string> {
  const defaults = new Map<string, string>()
  const css = fs.readFileSync(TAILWIND_THEME, "utf8").replace(COMMENT, "")
  parseDeclarations(readBlock(css, "@theme default {"), defaults)
  return defaults
}

function resolveVars(value: string, tokens: Map<string, string>): string {
  const resolved = value.replace(
    ANY_VAR_REFERENCE,
    (reference, name: string) => tokens.get(name) ?? reference
  )
  return resolved === value ? value : resolveVars(resolved, tokens)
}

/*
  Evaluate px and rem sums such as "calc(0.625rem - 4px)", or a length times a
  number such as "calc(1rem * 0.25)". Other math returns undefined.
*/
function toPx(value: string): number | undefined {
  const expression = value.replace(/^calc\((.*)\)$/, "$1").trim()

  const product = expression.match(MULTIPLY)
  if (product) {
    const base = toPx(product[1])
    return base === undefined ? undefined : base * Number(product[2])
  }

  let total = 0

  const rest = expression.replace(
    LENGTH_TERM,
    (_term, sign: string | undefined, amount: string, unit: string) => {
      const px = Number(amount) * (unit === "rem" ? ROOT_FONT_SIZE : 1)
      total += sign === "-" ? -px : px
      return ""
    }
  )

  return rest.trim() === "" ? total : undefined
}

/* Project radii override Tailwind defaults, unless the project resets the namespace */
function readRadiusScale(
  theme: Map<string, string>,
  root: Map<string, string>,
  resets: Set<string>
): RadiusToken[] {
  const defaults = resets.has("radius")
    ? new Map<string, string>()
    : readTailwindDefaults()
  const names = new Set(
    [...defaults.keys(), ...theme.keys()].filter((name) =>
      name.startsWith("radius-")
    )
  )

  return [...names].map((name) => {
    const projectValue = theme.get(name)
    const value = projectValue ?? defaults.get(name) ?? ""
    const px = toPx(resolveVars(value, root))

    return {
      name,
      value,
      source: projectValue ? "project" : "tailwind",
      px,
      rem:
        px === undefined ? undefined : Number((px / ROOT_FONT_SIZE).toFixed(4)),
    }
  })
}

export function readDesignTokens(): DesignTokens {
  const root = new Map<string, string>()
  const dark = new Map<string, string>()
  const theme = new Map<string, string>()
  const resets = new Set<string>()
  const files: string[] = []

  const cssFiles = fs
    .readdirSync(CSS_DIR)
    .filter((file) => file.endsWith(".css"))
    .sort()

  for (const file of cssFiles) {
    const css = fs
      .readFileSync(path.join(CSS_DIR, file), "utf8")
      .replace(COMMENT, "")
    const blocks = [...css.matchAll(TOKEN_BLOCK)]
    if (blocks.length === 0) continue

    files.push(file)
    for (const [, selector, body] of blocks) {
      const target = selector.startsWith(":root")
        ? root
        : selector === ".dark"
          ? dark
          : theme
      parseDeclarations(body, target)
      if (target === theme) {
        for (const [, namespace] of body.matchAll(NAMESPACE_RESET)) {
          resets.add(namespace)
        }
      }
    }
  }

  /* A theme alias shows its raw token, so the raw token is not listed again */
  const aliased = new Set<string>()
  const themeTokens = [...theme].map(([name, value]): ThemeToken => {
    const source = value.match(VAR_REFERENCE)?.[1]
    if (!source) return { name, value }

    if (name === source || name === `color-${source}`) aliased.add(source)
    return { name, value, light: root.get(source), dark: dark.get(source) }
  })

  const withPrefix = (prefix: string) =>
    themeTokens.filter((token) => token.name.startsWith(prefix))

  const palette: PaletteFamily[] = []
  const paletteNames = new Set<string>()
  for (const [name, value] of root) {
    const match = name.match(PALETTE_NAME)
    if (!match || !COLOR_LITERAL.test(value)) continue

    const [, familyName, step] = match
    let family = palette.find((item) => item.name === familyName)
    if (!family) {
      family = { name: familyName, colors: [] }
      palette.push(family)
    }
    family.colors.push({ name, step, value })
    paletteNames.add(name)
  }

  return {
    files,
    palette,
    colors: withPrefix("color-"),
    fonts: withPrefix("font-"),
    radius: readRadiusScale(theme, root, resets),
    shadows: withPrefix("shadow"),
    other: [...root.keys()]
      .filter((name) => !aliased.has(name) && !paletteNames.has(name))
      .map((name) => ({ name, light: root.get(name), dark: dark.get(name) })),
  }
}
