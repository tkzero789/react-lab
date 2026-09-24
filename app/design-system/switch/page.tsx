/* Switch docs with a preview for each size and state */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Switch",
  description: "A control that turns one setting on or off at once.",
}

export default function SwitchPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Switch" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Switch"
            description="A control that turns one setting on or off at once."
          />
          <Preview className="min-h-60">
            <Field orientation="horizontal" className="w-auto">
              <Switch id="switch-preview" defaultChecked />
              <FieldLabel htmlFor="switch-preview">Automatic deploys</FieldLabel>
            </Field>
          </Preview>
        </div>

        <Example
          title="Size"
          description={
            <>
              Set <code>{'size="sm"'}</code>. Omit <code>size</code> for the
              default.
            </>
          }
        >
          <Switch size="sm" defaultChecked aria-label="Small" />
          <Switch defaultChecked aria-label="Default" />
        </Example>

        <Example
          title="States"
          description={
            <>
              Set <code>defaultChecked</code> for the on state, and{" "}
              <code>disabled</code> to lock it.
            </>
          }
        >
          <Switch aria-label="Off" />
          <Switch defaultChecked aria-label="On" />
          <Switch disabled aria-label="Disabled off" />
          <Switch disabled defaultChecked aria-label="Disabled on" />
        </Example>

        <Example
          title="With Label"
          description={
            <>
              Put the switch and its label in a horizontal <code>Field</code>.
              Use <code>Switch</code> for a setting that applies at once, and a
              checkbox for a value the user submits.
            </>
          }
        >
          <FieldGroup className="w-full max-w-sm gap-4">
            <Field orientation="horizontal">
              <Switch id="switch-preview-builds" defaultChecked />
              <FieldLabel htmlFor="switch-preview-builds">
                Preview builds
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Switch id="switch-analytics" />
              <FieldLabel htmlFor="switch-analytics">Analytics</FieldLabel>
            </Field>
          </FieldGroup>
        </Example>

        <Example
          title="With Description"
          description={
            <>
              Add <code>FieldDescription</code> to explain what the setting
              changes.
            </>
          }
        >
          <Field orientation="horizontal" className="w-full max-w-sm">
            <Switch id="switch-protect" defaultChecked />
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor="switch-protect">
                Protect production
              </FieldLabel>
              <FieldDescription>
                A deploy to production needs a review first.
              </FieldDescription>
            </div>
          </Field>
        </Example>
      </DashboardContainer>
    </>
  )
}
