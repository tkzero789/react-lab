/* Skeleton docs with a preview for common loading shapes */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Skeleton",
  description: "A grey block that stands in for content while it loads.",
}

export default function SkeletonPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Skeleton" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Skeleton"
            description="A grey block that stands in for content while it loads."
          />
          <Preview className="min-h-60">
            <div className="flex w-full max-w-sm flex-col gap-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Preview>
        </div>

        <Example
          title="Size"
          description={
            <>
              Set the size with <code>className</code>. The skeleton is full
              width until you limit it.
            </>
          }
        >
          <div className="flex w-full max-w-sm flex-col gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8" />
          </div>
        </Example>

        <Example
          title="Shape"
          description={
            <>
              Add <code>rounded-full</code> for an avatar, or{" "}
              <code>rounded-lg</code> for a card.
            </>
          }
        >
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="h-16 w-28 rounded-lg" />
        </Example>

        <Example
          title="Card Placeholder"
          description={
            <>
              Match the layout of the real content, so the page does not jump
              when it loads.
            </>
          }
        >
          <Card className="w-full max-w-sm">
            <CardContent className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </Example>
      </DashboardContainer>
    </>
  )
}
