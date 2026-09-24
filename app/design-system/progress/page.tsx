/* Progress docs with a preview for each state */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Progress",
  description: "A bar that shows how much of a task is done.",
}

export default function ProgressPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Progress" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Progress"
            description="A bar that shows how much of a task is done."
          />
          <Preview className="min-h-60">
            <Progress value={64} className="w-full max-w-sm">
              <ProgressLabel>Uploading</ProgressLabel>
              <ProgressValue />
            </Progress>
          </Preview>
        </div>

        <Example
          title="Value"
          description={
            <>
              Set <code>value</code> from 0 to 100. The track and the indicator
              render on their own.
            </>
          }
        >
          <div className="flex w-full max-w-sm flex-col gap-6">
            <Progress value={0} />
            <Progress value={35} />
            <Progress value={100} />
          </div>
        </Example>

        <Example
          title="Label and Value"
          description={
            <>
              Add <code>ProgressLabel</code> and <code>ProgressValue</code> as
              children. <code>ProgressValue</code> prints the percent.
            </>
          }
        >
          <Progress value={42} className="w-full max-w-sm">
            <ProgressLabel>Importing records</ProgressLabel>
            <ProgressValue />
          </Progress>
        </Example>

        <Example
          title="Indeterminate"
          description={
            <>
              Set <code>{"value={null}"}</code> when the length of the task is
              unknown.
            </>
          }
        >
          <Progress value={null} className="w-full max-w-sm">
            <ProgressLabel>Connecting</ProgressLabel>
          </Progress>
        </Example>
      </DashboardContainer>
    </>
  )
}
