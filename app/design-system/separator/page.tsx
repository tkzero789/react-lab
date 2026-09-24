/* Separator docs with a preview for each orientation */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Separator } from "@/components/ui/separator"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Separator",
  description: "A line that divides two groups of content.",
}

export default function SeparatorPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Separator" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Separator"
            description="A line that divides two groups of content."
          />
          <Preview className="min-h-60">
            <div className="flex w-full max-w-sm flex-col gap-4">
              <span className="text-sm">Account</span>
              <Separator />
              <span className="text-sm">Billing</span>
            </div>
          </Preview>
        </div>

        <Example
          title="Horizontal"
          description={
            <>
              Omit <code>orientation</code>. The line fills the width of its
              parent.
            </>
          }
        >
          <div className="flex w-full max-w-sm flex-col gap-4">
            <span className="text-sm text-muted-foreground">Above</span>
            <Separator />
            <span className="text-sm text-muted-foreground">Below</span>
          </div>
        </Example>

        <Example
          title="Vertical"
          description={
            <>
              Set <code>{'orientation="vertical"'}</code>. The parent needs a
              height, so use a flex row.
            </>
          }
        >
          <div className="flex h-8 items-center gap-4">
            <span className="text-sm text-muted-foreground">Docs</span>
            <Separator orientation="vertical" />
            <span className="text-sm text-muted-foreground">Source</span>
            <Separator orientation="vertical" />
            <span className="text-sm text-muted-foreground">Support</span>
          </div>
        </Example>
      </DashboardContainer>
    </>
  )
}
