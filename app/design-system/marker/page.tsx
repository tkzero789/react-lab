/* Marker docs with a preview for each variant */
import type { Metadata } from "next"
import { Info, Lock } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Marker",
  description: "A system note or divider between messages.",
}

export default function MarkerPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Marker" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Marker"
            description="A system note or divider between messages."
          />
          <Preview className="min-h-60">
            <Marker variant="separator" className="max-w-sm">
              <MarkerContent>Today</MarkerContent>
            </Marker>
          </Preview>
        </div>

        <Example
          title="Separator"
          description={
            <>
              Set <code>{'variant="separator"'}</code> for a line on each side
              of the text. Use it for a date between messages.
            </>
          }
        >
          <div className="flex w-full max-w-sm flex-col gap-4">
            <Marker variant="separator">
              <MarkerContent>Yesterday</MarkerContent>
            </Marker>
            <Marker variant="separator">
              <MarkerContent>New messages</MarkerContent>
            </Marker>
          </div>
        </Example>

        <Example
          title="With Icon"
          description={
            <>
              Put the icon in <code>MarkerIcon</code> so it keeps its size and
              is hidden from a screen reader.
            </>
          }
        >
          <div className="flex w-full max-w-sm flex-col gap-3">
            <Marker>
              <MarkerIcon>
                <Lock />
              </MarkerIcon>
              <MarkerContent>This chat is end to end encrypted.</MarkerContent>
            </Marker>
            <Marker>
              <MarkerIcon>
                <Info />
              </MarkerIcon>
              <MarkerContent>Anna joined the conversation.</MarkerContent>
            </Marker>
          </div>
        </Example>

        <Example
          title="Border"
          description={
            <>
              Set <code>{'variant="border"'}</code> for a line under the note,
              which suits the head of a thread.
            </>
          }
        >
          <Marker variant="border" className="max-w-sm">
            <MarkerContent>3 replies</MarkerContent>
          </Marker>
        </Example>
      </DashboardContainer>
    </>
  )
}
