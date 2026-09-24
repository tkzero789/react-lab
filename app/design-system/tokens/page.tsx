/* Design tokens page that shows every CSS custom property in app/css */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import DocsHeader from "../components/docs-header"
import { Description, Example } from "../components/example"
import { readDesignTokens, type ThemeToken } from "./read-tokens"

/* The token reader uses fs, so the page must render at build time only */
export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Design Tokens",
  description: "Every CSS custom property that the UI is built on.",
}

/* Show the palette name that a semantic token refers to, such as granite-900 */
function paletteName(value?: string) {
  return value?.match(/^var\(--([\w-]+)\)$/)?.[1] ?? value
}

function PaletteSwatch({ name, label }: { name: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <div
        className="h-10 rounded-lg border"
        style={{ background: `var(--${name})` }}
      />
      <span className="truncate font-mono text-xs text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

function ColorToken({ token }: { token: ThemeToken }) {
  const name = token.name.replace(/^color-/, "")

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex h-14 overflow-hidden rounded-lg border">
        <div className="flex-1" style={{ background: token.light }} />
        <div
          className="flex-1"
          style={{ background: token.dark ?? token.light }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{name}</span>
        <div className="grid grid-cols-2 gap-2 font-mono text-xs text-muted-foreground">
          <span className="truncate" title={token.light}>
            {paletteName(token.light)}
          </span>
          <span className="truncate" title={token.dark}>
            {paletteName(token.dark)}
          </span>
        </div>
      </div>
    </div>
  )
}

type RadiusBoxProps = {
  label: string
  value: string
  size?: string
  source: string
}

function RadiusBox({ label, value, size, source }: RadiusBoxProps) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <div
        className="size-20 border bg-muted"
        style={{ borderRadius: value }}
      />
      <span className="font-mono text-xs">{label}</span>
      {size ? <span className="font-mono text-xs">{size}</span> : null}
      <span
        className="max-w-full truncate font-mono text-xs text-muted-foreground"
        title={value}
      >
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{source}</span>
    </div>
  )
}

function ColorGrid({ tokens }: { tokens: ThemeToken[] }) {
  return (
    <div className="grid w-full grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
      {tokens.map((token) => (
        <ColorToken key={token.name} token={token} />
      ))}
    </div>
  )
}

export default function TokensPage() {
  const tokens = readDesignTokens()

  const chartColors = tokens.colors.filter((token) =>
    token.name.startsWith("color-chart-")
  )
  const themeColors = tokens.colors.filter(
    (token) => !chartColors.includes(token)
  )
  const baseColors = tokens.palette.filter(
    (family) => family.colors.length === 1
  )
  const colorScales = tokens.palette.filter(
    (family) => family.colors.length > 1
  )

  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Design Tokens" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-3">
          <DocsHeader
            title="Design Tokens"
            description="Every CSS custom property that the UI is built on."
          />
          <Description>
            Read from{" "}
            {tokens.files.map((file, index) => (
              <span key={file}>
                {index > 0 ? ", " : null}
                <code>app/css/{file}</code>
              </span>
            ))}
            . Swatches show light on the left and dark on the right.
          </Description>
        </div>

        <Example
          title="Palette"
          description={
            <>
              Semantic tokens refer to these colors, for example{" "}
              <code>{"--brand: var(--onyx)"}</code>. Do not use them in
              components. Tailwind has no <code>bg-granite-*</code> class for
              this reason.
            </>
          }
        >
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Base</span>
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-11">
                {baseColors.map((family) => (
                  <PaletteSwatch
                    key={family.name}
                    name={family.name}
                    label={family.name}
                  />
                ))}
              </div>
            </div>
            {colorScales.map((family) => (
              <div key={family.name} className="flex flex-col gap-2">
                <span className="text-sm font-medium">{family.name}</span>
                <div className="grid grid-cols-6 gap-2 sm:grid-cols-11">
                  {family.colors.map((color) => (
                    <PaletteSwatch
                      key={color.name}
                      name={color.name}
                      label={color.step ?? color.name}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Example>

        <Example
          title="Theme Colors"
          description={
            <>
              Use with <code>bg-*</code>, <code>text-*</code>, or{" "}
              <code>border-*</code>, for example{" "}
              <code>bg-brand text-brand-foreground</code>. Put text on a color
              with its <code>-foreground</code> pair.
            </>
          }
        >
          <ColorGrid tokens={themeColors} />
        </Example>

        <Example
          title="Chart Colors"
          description={
            <>
              Use <code>{"var(--chart-1)"}</code> to{" "}
              <code>{"var(--chart-5)"}</code> in a chart config.
            </>
          }
        >
          <ColorGrid tokens={chartColors} />
        </Example>

        <Example
          title="Font Family"
          description={
            <>
              Use <code>font-sans</code>, <code>font-serif</code>, or{" "}
              <code>font-mono</code>.
            </>
          }
        >
          <div className="flex w-full flex-col gap-6">
            {tokens.fonts.map((token) => (
              <div key={token.name} className="flex flex-col gap-1">
                <span className="font-mono text-xs text-muted-foreground">
                  {token.name}
                </span>
                <p className="text-2xl" style={{ fontFamily: token.value }}>
                  The quick brown fox jumps over the lazy dog
                </p>
                <span
                  className="truncate font-mono text-xs text-muted-foreground"
                  title={token.light}
                >
                  {token.light}
                </span>
              </div>
            ))}
          </div>
        </Example>

        <Example
          title="Radius"
          description={
            <>
              Use <code>rounded-lg</code> for every component,{" "}
              <code>rounded-xs</code> for badges, code, and keys, and{" "}
              <code>rounded-full</code> for avatars and pills. Change{" "}
              <code>--radius</code> to rescale every size.
            </>
          }
        >
          <div className="grid w-full grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-6">
            <RadiusBox
              label="rounded-none"
              value="0"
              size="0px / 0rem"
              source="Utility"
            />
            {tokens.radius.map((token) => (
              <RadiusBox
                key={token.name}
                label={token.name.replace("radius", "rounded")}
                value={token.value}
                size={
                  token.px === undefined
                    ? undefined
                    : `${token.px}px / ${token.rem}rem`
                }
                source={
                  token.source === "project"
                    ? "globals.css"
                    : "Tailwind default"
                }
              />
            ))}
            <RadiusBox
              label="rounded-full"
              value="calc(infinity * 1px)"
              source="Utility"
            />
          </div>
        </Example>

        <Example
          title="Shadow"
          description={
            <>
              Use <code>shadow-2xs</code> to <code>shadow-2xl</code> on
              surfaces.
            </>
          }
        >
          <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-4">
            {tokens.shadows.map((token) => (
              <div
                key={token.name}
                className="flex flex-col items-center gap-3"
              >
                <div
                  className="size-20 rounded-lg bg-card"
                  style={{ boxShadow: token.value }}
                />
                <span className="font-mono text-xs">{token.name}</span>
              </div>
            ))}
          </div>
        </Example>

        <Example
          title="Other"
          description={
            <>
              Tailwind and custom utilities read these directly, for example{" "}
              <code>--spacing</code> sets the step for <code>p-4</code> and{" "}
              <code>--scale-pressed</code> drives <code>pressable</code>.
            </>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Light</TableHead>
                <TableHead>Dark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="font-mono text-xs">
              {tokens.other.map((token) => (
                <TableRow key={token.name}>
                  <TableCell>--{token.name}</TableCell>
                  <TableCell>{token.light}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {token.dark ?? "Same as light"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Example>
      </DashboardContainer>
    </>
  )
}
