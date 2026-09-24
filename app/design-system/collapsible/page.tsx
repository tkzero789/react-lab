/* Collapsible docs with a preview for each state */
import type { Metadata } from "next"
import { ChevronsUpDown } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Collapsible",
  description: "A trigger that shows or hides one block of content.",
}

export default function CollapsiblePage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Collapsible" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Collapsible"
            description="A trigger that shows or hides one block of content."
          />
          <Preview className="min-h-60">
            <Collapsible className="flex w-full max-w-sm flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium">Build settings</span>
                <CollapsibleTrigger
                  render={
                    <Button variant="ghost" size="icon-sm" aria-label="Toggle" />
                  }
                >
                  <ChevronsUpDown />
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="flex flex-col gap-2">
                <div className="rounded-lg bg-muted px-3 py-2 font-mono text-xs">
                  next build
                </div>
                <div className="rounded-lg bg-muted px-3 py-2 font-mono text-xs">
                  next start
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Preview>
        </div>

        <Example
          title="Default Open"
          description={
            <>
              Set <code>defaultOpen</code> so the content starts visible.
            </>
          }
        >
          <Collapsible defaultOpen className="flex w-full max-w-sm flex-col gap-2">
            <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
              Toggle details
            </CollapsibleTrigger>
            <CollapsibleContent className="rounded-lg bg-muted px-3 py-2 text-sm">
              This content is open when the page renders.
            </CollapsibleContent>
          </Collapsible>
        </Example>

        <Example
          title="Disabled"
          description={
            <>
              Set <code>disabled</code> on <code>Collapsible</code> to lock the
              current state.
            </>
          }
        >
          <Collapsible disabled className="flex w-full max-w-sm flex-col gap-2">
            <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
              Locked
            </CollapsibleTrigger>
            <CollapsibleContent className="rounded-lg bg-muted px-3 py-2 text-sm">
              You cannot open this.
            </CollapsibleContent>
          </Collapsible>
        </Example>
      </DashboardContainer>
    </>
  )
}
