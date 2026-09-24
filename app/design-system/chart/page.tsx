/* Chart docs with a preview for each chart type */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"
import { ChartArea, ChartBar, ChartLine, ChartMultiple } from "./chart-demo"

export const metadata: Metadata = {
  title: "Chart",
  description: "A wrapper that gives Recharts the theme of the app.",
}

export default function ChartPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Chart" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Chart"
            description="A wrapper that gives Recharts the theme of the app."
          />
          <Preview className="min-h-60">
            <ChartBar />
          </Preview>
        </div>

        <Example
          title="Config"
          description={
            <>
              Pass a <code>config</code> to <code>ChartContainer</code>. Each
              key gets a label and a color, and the container turns the color
              into <code>var(--color-KEY)</code> for the series to use.
            </>
          }
        >
          <ChartBar />
        </Example>

        <Example
          title="Colors"
          description={
            <>
              Use <code>{"var(--chart-1)"}</code> to{" "}
              <code>{"var(--chart-5)"}</code> in the config, so the chart
              follows the theme in light and dark mode.
            </>
          }
        >
          <ChartMultiple />
        </Example>

        <Example
          title="Tooltip and Legend"
          description={
            <>
              Pass <code>{"<ChartTooltipContent />"}</code> to{" "}
              <code>ChartTooltip</code>, and{" "}
              <code>{"<ChartLegendContent />"}</code> to{" "}
              <code>ChartLegend</code>. Set{" "}
              <code>{'indicator="line"'}</code> or <code>{'"dashed"'}</code> to
              change the mark.
            </>
          }
        >
          <ChartLine />
        </Example>

        <Example
          title="Area"
          description={
            <>
              Any Recharts chart works inside the container. Set the height with{" "}
              <code>className</code>, because the container fills its parent.
            </>
          }
        >
          <ChartArea />
        </Example>
      </DashboardContainer>
    </>
  )
}
