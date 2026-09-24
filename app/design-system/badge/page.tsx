/* Badge docs with a preview for each variant */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Badge } from "@/components/ui/badge"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Badge",
  description: "A small label for a status or a count.",
}

export default function BadgePage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Badge" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Badge"
            description="A small label for a status or a count."
          />
          <Preview className="min-h-60">
            <Badge>Badge</Badge>
          </Preview>
        </div>

        <Example
          title="Default"
          description={
            <>
              Omit <code>variant</code>. The badge uses the brand color.
            </>
          }
        >
          <Badge>Live</Badge>
        </Example>

        <Example
          title="Muted"
          description={
            <>
              Set <code>{'variant="muted"'}</code> for a quiet label.
            </>
          }
        >
          <Badge variant="muted">Draft</Badge>
        </Example>

        <Example
          title="Destructive"
          description={
            <>
              Set <code>{'variant="destructive"'}</code> for a failure or a
              block.
            </>
          }
        >
          <Badge variant="destructive">Failed</Badge>
        </Example>

        <Example
          title="Outline"
          description={
            <>
              Set <code>{'variant="outline"'}</code> for a border with no fill.
            </>
          }
        >
          <Badge variant="outline">Queued</Badge>
        </Example>

        <Example
          title="In Text"
          description={
            <>
              The badge is inline, so it sits next to text without extra layout.
            </>
          }
        >
          <p className="flex items-center gap-2 text-sm">
            Build 421 <Badge variant="muted">2 min</Badge>
          </p>
        </Example>
      </DashboardContainer>
    </>
  )
}
