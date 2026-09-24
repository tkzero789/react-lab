/* Loader docs with a preview of the full area loading state */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import Loader from "@/components/ui/loader"
import { Spinner } from "@/components/ui/spinner"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Loader",
  description: "A loading mark that centers itself in the closest box.",
}

export default function LoaderPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Loader" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Loader"
            description="A loading mark that centers itself in the closest box."
          />
          <Preview className="min-h-60">
            <div className="relative h-40 w-full max-w-sm rounded-lg border">
              <Loader />
            </div>
          </Preview>
        </div>

        <Example
          title="Positioning"
          description={
            <>
              The loader is absolute and centered, so the parent needs{" "}
              <code>relative</code> and a height. It takes no props, and its
              look comes from the <code>loader</code> class in{" "}
              <code>app/css</code>.
            </>
          }
        >
          <div className="relative h-32 w-full max-w-sm rounded-lg bg-muted">
            <Loader />
          </div>
        </Example>

        <Example
          title="Loader or Spinner"
          description={
            <>
              Use <code>Loader</code> for a whole area or route that is loading.
              Use <code>Spinner</code> inside a button or a line of text.
            </>
          }
        >
          <div className="flex w-full max-w-sm items-center justify-center gap-6">
            <div className="relative h-24 flex-1 rounded-lg border">
              <Loader />
            </div>
            <div className="flex flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
              <Spinner />
              Saving
            </div>
          </div>
        </Example>
      </DashboardContainer>
    </>
  )
}
