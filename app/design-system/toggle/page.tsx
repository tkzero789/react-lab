/* Toggle docs with a preview for each variant, size, and state */
import type { Metadata } from "next"
import { Bell, Bold, Star } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Toggle } from "@/components/ui/toggle"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Toggle",
  description: "A button that stays pressed until the user presses it again.",
}

export default function TogglePage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Toggle" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Toggle"
            description="A button that stays pressed until the user presses it again."
          />
          <Preview className="min-h-60">
            <Toggle variant="outline" aria-label="Bold">
              <Bold />
            </Toggle>
          </Preview>
        </div>

        <Example
          title="Variant"
          description={
            <>
              Set <code>{'variant="outline"'}</code> for a border. Omit it for a
              plain background.
            </>
          }
        >
          <Toggle aria-label="Star">
            <Star />
          </Toggle>
          <Toggle variant="outline" aria-label="Star">
            <Star />
          </Toggle>
        </Example>

        <Example
          title="Size"
          description={
            <>
              Set <code>{'size="sm"'}</code> or <code>{'size="lg"'}</code>.
            </>
          }
        >
          <Toggle variant="outline" size="sm" aria-label="Small">
            <Bell />
          </Toggle>
          <Toggle variant="outline" aria-label="Default">
            <Bell />
          </Toggle>
          <Toggle variant="outline" size="lg" aria-label="Large">
            <Bell />
          </Toggle>
        </Example>

        <Example
          title="With Text"
          description={
            <>
              The toggle takes text as well as an icon. Add{" "}
              <code>{'data-icon="inline-start"'}</code> to tighten the padding.
            </>
          }
        >
          <Toggle variant="outline" defaultPressed>
            <Bell data-icon="inline-start" />
            Notifications
          </Toggle>
        </Example>

        <Example
          title="States"
          description={
            <>
              Set <code>defaultPressed</code> for the on state, and{" "}
              <code>disabled</code> to lock it. Use a <code>Switch</code>{" "}
              instead when the control is a setting in a form.
            </>
          }
        >
          <Toggle variant="outline" defaultPressed aria-label="Pressed">
            <Star />
          </Toggle>
          <Toggle variant="outline" disabled aria-label="Disabled">
            <Star />
          </Toggle>
        </Example>
      </DashboardContainer>
    </>
  )
}
