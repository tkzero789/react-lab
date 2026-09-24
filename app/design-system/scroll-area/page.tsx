/* Scroll Area docs with a preview for each direction */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Scroll Area",
  description: "A box that scrolls with a styled scrollbar.",
}

const tags = Array.from({ length: 24 }, (_, index) => `v1.2.${index}`)

export default function ScrollAreaPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Scroll Area" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Scroll Area"
            description="A box that scrolls with a styled scrollbar."
          />
          <Preview className="min-h-60">
            <ScrollArea className="h-48 w-full max-w-xs rounded-lg border">
              <div className="flex flex-col p-3 text-sm">
                {tags.map((tag) => (
                  <div key={tag} className="flex flex-col">
                    {tag}
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Preview>
        </div>

        <Example
          title="Height"
          description={
            <>
              Set a height on <code>ScrollArea</code>. The content scrolls
              inside, and the page does not.
            </>
          }
        >
          <ScrollArea className="h-32 w-full max-w-xs rounded-lg border p-3 text-sm text-muted-foreground">
            <p className="mb-3">
              Use a scroll area for a list inside a panel, such as a sidebar or
              a popover.
            </p>
            <p className="mb-3">
              It keeps the scrollbar in the style of the app on every browser.
            </p>
            <p>Do not use it for the whole page.</p>
          </ScrollArea>
        </Example>

        <Example
          title="Horizontal"
          description={
            <>
              Give the content a width wider than the box. The horizontal bar
              appears on its own.
            </>
          }
        >
          <ScrollArea className="w-full max-w-sm rounded-lg border">
            <div className="flex gap-3 p-3">
              {Array.from({ length: 10 }, (_, index) => (
                <div
                  key={index}
                  className="flex size-24 shrink-0 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground"
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Example>
      </DashboardContainer>
    </>
  )
}
