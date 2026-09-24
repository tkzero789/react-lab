/* Radio Group docs with a preview for each layout */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Radio Group",
  description: "A set of options where the user picks exactly one.",
}

export default function RadioGroupPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Radio Group" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Radio Group"
            description="A set of options where the user picks exactly one."
          />
          <Preview className="min-h-60">
            <RadioGroup defaultValue="weekly" className="max-w-sm">
              <Field orientation="horizontal">
                <RadioGroupItem value="daily" id="radio-daily" />
                <FieldLabel htmlFor="radio-daily">Daily</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="weekly" id="radio-weekly" />
                <FieldLabel htmlFor="radio-weekly">Weekly</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="never" id="radio-never" />
                <FieldLabel htmlFor="radio-never">Never</FieldLabel>
              </Field>
            </RadioGroup>
          </Preview>
        </div>

        <Example
          title="With Legend"
          description={
            <>
              Wrap the group in a <code>FieldSet</code> and name it with a{" "}
              <code>FieldLegend</code>.
            </>
          }
        >
          <FieldSet className="w-full max-w-sm">
            <FieldLegend variant="label">Deploy target</FieldLegend>
            <RadioGroup defaultValue="preview">
              <Field orientation="horizontal">
                <RadioGroupItem value="production" id="radio-production" />
                <FieldLabel htmlFor="radio-production">Production</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="preview" id="radio-preview" />
                <FieldLabel htmlFor="radio-preview">Preview</FieldLabel>
              </Field>
            </RadioGroup>
          </FieldSet>
        </Example>

        <Example
          title="With Description"
          description={
            <>
              Put the label and its help text in a column next to the control.
            </>
          }
        >
          <RadioGroup defaultValue="team" className="w-full max-w-sm gap-4">
            <Field orientation="horizontal">
              <RadioGroupItem value="personal" id="radio-personal" />
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="radio-personal">Personal</FieldLabel>
                <FieldDescription>One user, one project.</FieldDescription>
              </div>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="team" id="radio-team" />
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="radio-team">Team</FieldLabel>
                <FieldDescription>
                  Shared projects, roles, and audit logs.
                </FieldDescription>
              </div>
            </Field>
          </RadioGroup>
        </Example>

        <Example
          title="Disabled"
          description={
            <>
              Set <code>disabled</code> on one item, or on{" "}
              <code>RadioGroup</code> for the whole set.
            </>
          }
        >
          <FieldGroup className="max-w-sm">
            <RadioGroup defaultValue="free">
              <Field orientation="horizontal">
                <RadioGroupItem value="free" id="radio-free" />
                <FieldLabel htmlFor="radio-free">Free</FieldLabel>
              </Field>
              <Field orientation="horizontal" data-disabled>
                <RadioGroupItem value="enterprise" id="radio-enterprise" disabled />
                <FieldLabel htmlFor="radio-enterprise">
                  Enterprise, sales only
                </FieldLabel>
              </Field>
            </RadioGroup>
          </FieldGroup>
        </Example>
      </DashboardContainer>
    </>
  )
}
