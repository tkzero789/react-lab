/* Aspect Ratio docs with a preview for each ratio */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { AspectRatio } from "@/components/ui/aspect-ratio"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Aspect Ratio",
  description: "A box that keeps the same width to height ratio.",
}

export default function AspectRatioPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Aspect Ratio" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Aspect Ratio"
            description="A box that keeps the same width to height ratio."
          />
          <Preview className="min-h-60">
            <AspectRatio
              ratio={16 / 9}
              className="w-full max-w-md rounded-lg bg-muted"
            />
          </Preview>
        </div>

        <Example
          title="Ratio"
          description={
            <>
              Set <code>ratio</code> to a number such as{" "}
              <code>{"{16 / 9}"}</code>. The box fills the width of its parent
              and sets its own height.
            </>
          }
        >
          <div className="grid w-full gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <AspectRatio ratio={1} className="rounded-lg bg-muted" />
              <span className="text-center font-mono text-xs text-muted-foreground">
                1 / 1
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <AspectRatio ratio={4 / 3} className="rounded-lg bg-muted" />
              <span className="text-center font-mono text-xs text-muted-foreground">
                4 / 3
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <AspectRatio ratio={16 / 9} className="rounded-lg bg-muted" />
              <span className="text-center font-mono text-xs text-muted-foreground">
                16 / 9
              </span>
            </div>
          </div>
        </Example>

        <Example
          title="With Content"
          description={
            <>
              Put the child on <code>absolute inset-0</code>, or give it{" "}
              <code>size-full</code>, so it fills the box.
            </>
          }
        >
          <AspectRatio
            ratio={21 / 9}
            className="w-full max-w-lg overflow-hidden rounded-lg border"
          >
            <div className="flex size-full items-center justify-center bg-muted text-sm text-muted-foreground">
              21 / 9 banner
            </div>
          </AspectRatio>
        </Example>
      </DashboardContainer>
    </>
  )
}
