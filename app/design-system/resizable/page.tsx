/* Resizable docs with a preview for each layout */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Resizable",
  description: "Panels the user can drag to change their size.",
}

export default function ResizablePage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Resizable" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Resizable"
            description="Panels the user can drag to change their size."
          />
          <Preview className="min-h-60">
            <ResizablePanelGroup
              orientation="horizontal"
              className="h-40 max-w-md rounded-lg border"
            >
              <ResizablePanel defaultSize={40}>
                <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                  Sidebar
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={60}>
                <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                  Content
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </Preview>
        </div>

        <Example
          title="Orientation"
          description={
            <>
              Set <code>orientation</code> on <code>ResizablePanelGroup</code> to{" "}
              <code>horizontal</code> or <code>vertical</code>. The group needs
              a height.
            </>
          }
        >
          <ResizablePanelGroup
            orientation="vertical"
            className="h-48 max-w-md rounded-lg border"
          >
            <ResizablePanel defaultSize={60}>
              <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                Editor
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40}>
              <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                Output
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Example>

        <Example
          title="Limits"
          description={
            <>
              Set <code>defaultSize</code>, <code>minSize</code>, and{" "}
              <code>maxSize</code> as percentages of the group.
            </>
          }
        >
          <ResizablePanelGroup
            orientation="horizontal"
            className="h-40 max-w-md rounded-lg border"
          >
            <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
              <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                20 to 50
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                The rest
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Example>

        <Example
          title="Handle"
          description={
            <>
              Set <code>withHandle</code> to draw the grip. Without it the
              divider is a plain line that still works.
            </>
          }
        >
          <ResizablePanelGroup
            orientation="horizontal"
            className="h-32 max-w-md rounded-lg border"
          >
            <ResizablePanel>
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                One
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Two
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Example>
      </DashboardContainer>
    </>
  )
}
