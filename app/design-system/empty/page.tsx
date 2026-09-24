/* Empty docs with a preview for each empty state layout */
import type { Metadata } from "next"
import { FolderOpen, Search, TriangleAlert } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Empty",
  description: "The state of a list or a page that has nothing to show.",
}

export default function EmptyPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Empty" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Empty"
            description="The state of a list or a page that has nothing to show."
          />
          <Preview className="min-h-60">
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderOpen />
                </EmptyMedia>
                <EmptyTitle>No projects yet</EmptyTitle>
                <EmptyDescription>
                  Create a project to see builds and domains here.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button>New project</Button>
              </EmptyContent>
            </Empty>
          </Preview>
        </div>

        <Example
          title="Media"
          description={
            <>
              Set <code>{'variant="icon"'}</code> on <code>EmptyMedia</code> for
              a tile behind the icon. Omit it for a plain icon or an image.
            </>
          }
        >
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia>
                <Search className="size-8 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No result</EmptyTitle>
              <EmptyDescription>
                No project matches that search. Try another word.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Example>

        <Example
          title="With Actions"
          description={
            <>
              Put the next step in <code>EmptyContent</code>. Keep it to one
              main action.
            </>
          }
        >
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TriangleAlert />
              </EmptyMedia>
              <EmptyTitle>The build failed</EmptyTitle>
              <EmptyDescription>
                The last build stopped after 12 seconds.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center">
              <Button>Try again</Button>
              <Button variant="outline">Read the log</Button>
            </EmptyContent>
          </Empty>
        </Example>

        <Example
          title="Dashed Border"
          description={
            <>
              The component carries <code>border-dashed</code> already. Add{" "}
              <code>border</code> to draw it, and leave it off when the parent
              has its own border.
            </>
          }
        >
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>Drop files here</EmptyTitle>
              <EmptyDescription>PNG or JPG, up to 5 MB.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Example>
      </DashboardContainer>
    </>
  )
}
