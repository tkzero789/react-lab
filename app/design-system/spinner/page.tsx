/* Spinner docs with a preview for each size and use */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Spinner",
  description: "A turning icon that shows work is in progress.",
}

export default function SpinnerPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Spinner" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Spinner"
            description="A turning icon that shows work is in progress."
          />
          <Preview className="min-h-60">
            <Spinner />
          </Preview>
        </div>

        <Example
          title="Size"
          description={
            <>
              Set the size with <code>className</code>, for example{" "}
              <code>size-6</code>. The default is <code>size-4</code>.
            </>
          }
        >
          <Spinner className="size-3" />
          <Spinner />
          <Spinner className="size-6" />
          <Spinner className="size-8" />
        </Example>

        <Example
          title="In a Button"
          description={
            <>
              Add <code>{'data-icon="inline-start"'}</code> and set{" "}
              <code>disabled</code> while the action runs.
            </>
          }
        >
          <Button disabled>
            <Spinner data-icon="inline-start" />
            Saving
          </Button>
          <Button variant="outline" disabled>
            <Spinner data-icon="inline-start" />
            Loading
          </Button>
        </Example>

        <Example
          title="Color"
          description={
            <>
              The spinner takes the current text color. Set{" "}
              <code>text-muted-foreground</code> to make it quiet.
            </>
          }
        >
          <Spinner className="text-muted-foreground" />
          <Spinner className="text-brand" />
          <Spinner className="text-destructive" />
        </Example>

        <Example
          title="With Text"
          description={
            <>
              The icon carries <code>{'role="status"'}</code> and an{" "}
              <code>aria-label</code>, so a screen reader announces it.
            </>
          }
        >
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner />
            Checking the build
          </span>
        </Example>
      </DashboardContainer>
    </>
  )
}
