/* Label docs with a preview for each pairing */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Label",
  description: "The name of a form control.",
}

export default function LabelPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Label" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Label"
            description="The name of a form control."
          />
          <Preview className="min-h-60">
            <div className="flex w-full max-w-sm flex-col gap-2">
              <Label htmlFor="label-email">Email</Label>
              <Input id="label-email" type="email" placeholder="name@example.com" />
            </div>
          </Preview>
        </div>

        <Example
          title="Prefer FieldLabel"
          description={
            <>
              In a form, use <code>Field</code> and <code>FieldLabel</code>{" "}
              instead. They handle the layout, the disabled state, and the
              invalid state. Use <code>Label</code> on its own only outside a
              form.
            </>
          }
        >
          <div className="flex w-full max-w-sm flex-col gap-2">
            <Label htmlFor="label-search">Search</Label>
            <Input id="label-search" placeholder="Type to filter" />
          </div>
        </Example>

        <Example
          title="With Checkbox"
          description={
            <>
              Set <code>htmlFor</code> to the control id, so a click on the text
              toggles the control.
            </>
          }
        >
          <div className="flex items-center gap-2">
            <Checkbox id="label-checkbox" />
            <Label htmlFor="label-checkbox">Remember this device</Label>
          </div>
        </Example>

        <Example
          title="Disabled"
          description={
            <>
              The label fades when the control next to it is disabled, through{" "}
              <code>peer-disabled</code>.
            </>
          }
        >
          <div className="flex items-center gap-2">
            <Checkbox id="label-disabled" disabled className="peer" />
            <Label htmlFor="label-disabled">Not available</Label>
          </div>
        </Example>
      </DashboardContainer>
    </>
  )
}
