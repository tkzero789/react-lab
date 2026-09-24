/* Calendar docs with a preview for each selection mode */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Calendar",
  description: "A month view for picking a date or a range.",
}

const june = new Date(2026, 5, 12)
const juneStart = new Date(2026, 5, 8)
const juneEnd = new Date(2026, 5, 14)

export default function CalendarPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Calendar" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Calendar"
            description="A month view for picking a date or a range."
          />
          <Preview className="min-h-60">
            <Calendar
              mode="single"
              defaultMonth={june}
              selected={june}
              className="rounded-lg border"
            />
          </Preview>
        </div>

        <Example
          title="Mode"
          description={
            <>
              Set <code>mode</code> to <code>single</code>,{" "}
              <code>multiple</code>, or <code>range</code>. Hold the selection
              in state and pass <code>onSelect</code> in a client component.
            </>
          }
        >
          <Calendar
            mode="range"
            defaultMonth={june}
            selected={{ from: juneStart, to: juneEnd }}
            className="rounded-lg border"
          />
        </Example>

        <Example
          title="Caption Layout"
          description={
            <>
              Set <code>{'captionLayout="dropdown"'}</code> so the user can jump
              to a month or a year. The default is a plain label.
            </>
          }
        >
          <Calendar
            mode="single"
            captionLayout="dropdown"
            defaultMonth={june}
            startMonth={new Date(2020, 0)}
            endMonth={new Date(2030, 11)}
            className="rounded-lg border"
          />
        </Example>

        <Example
          title="Disabled Days"
          description={
            <>
              Pass <code>disabled</code> a date, an array, a range, or a
              function, to block days that cannot be picked.
            </>
          }
        >
          <Calendar
            mode="single"
            defaultMonth={june}
            disabled={{ dayOfWeek: [0, 6] }}
            className="rounded-lg border"
          />
        </Example>

        <Example
          title="In a Card"
          description={
            <>
              The calendar drops its own background inside a{" "}
              <code>CardContent</code> or a <code>PopoverContent</code>, so it
              sits on the surface of its parent.
            </>
          }
        >
          <Card className="w-fit">
            <CardContent className="p-0">
              <Calendar mode="single" defaultMonth={june} selected={june} />
            </CardContent>
          </Card>
        </Example>
      </DashboardContainer>
    </>
  )
}
