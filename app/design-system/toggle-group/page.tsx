/* Toggle Group docs with a preview for each variant, size, and spacing */
import type { Metadata } from "next"
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Toggle Group",
  description: "A row of toggles for a small set of options.",
}

export default function ToggleGroupPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Toggle Group" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Toggle Group"
            description="A row of toggles for a small set of options."
          />
          <Preview className="min-h-60">
            <ToggleGroup variant="outline" defaultValue={["center"]}>
              <ToggleGroupItem value="left" aria-label="Align left">
                <AlignLeft />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center">
                <AlignCenter />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right">
                <AlignRight />
              </ToggleGroupItem>
            </ToggleGroup>
          </Preview>
        </div>

        <Example
          title="When to Use"
          description={
            <>
              Use it for two to seven options that are always visible. Do not
              loop buttons and track the active one yourself.
            </>
          }
        >
          <ToggleGroup variant="outline" defaultValue={["week"]}>
            <ToggleGroupItem value="day">Day</ToggleGroupItem>
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
          </ToggleGroup>
        </Example>

        <Example
          title="Variant and Size"
          description={
            <>
              Set <code>variant</code> and <code>size</code> on the group. Every
              item takes them from there.
            </>
          }
        >
          <div className="flex flex-col items-center gap-4">
            <ToggleGroup defaultValue={["bold"]}>
              <ToggleGroupItem value="bold" aria-label="Bold">
                <Bold />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Italic">
                <Italic />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="Underline">
                <Underline />
              </ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup variant="outline" size="sm" defaultValue={["italic"]}>
              <ToggleGroupItem value="bold" aria-label="Bold">
                <Bold />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Italic">
                <Italic />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </Example>

        <Example
          title="Joined"
          description={
            <>
              Set <code>{"spacing={0}"}</code> so the items sit together as one
              control, with rounded corners on the ends only.
            </>
          }
        >
          <ToggleGroup variant="outline" spacing={0} defaultValue={["grid"]}>
            <ToggleGroupItem value="list">List</ToggleGroupItem>
            <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
            <ToggleGroupItem value="board">Board</ToggleGroupItem>
          </ToggleGroup>
        </Example>

        <Example
          title="Vertical"
          description={
            <>
              Set <code>{'orientation="vertical"'}</code> to stack the items.
            </>
          }
        >
          <ToggleGroup
            variant="outline"
            orientation="vertical"
            spacing={0}
            defaultValue={["all"]}
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="open">Open</ToggleGroupItem>
            <ToggleGroupItem value="closed">Closed</ToggleGroupItem>
          </ToggleGroup>
        </Example>

        <Example
          title="Disabled Item"
          description={
            <>
              Set <code>disabled</code> on the item, or on the group for all of
              them.
            </>
          }
        >
          <ToggleGroup variant="outline" defaultValue={["read"]}>
            <ToggleGroupItem value="read">Read</ToggleGroupItem>
            <ToggleGroupItem value="write">Write</ToggleGroupItem>
            <ToggleGroupItem value="admin" disabled>
              Admin
            </ToggleGroupItem>
          </ToggleGroup>
        </Example>
      </DashboardContainer>
    </>
  )
}
