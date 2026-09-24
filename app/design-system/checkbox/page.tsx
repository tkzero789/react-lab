/* Checkbox docs with a preview for each state */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Checkbox",
  description: "A box the user ticks to turn one option on or off.",
}

export default function CheckboxPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Checkbox" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Checkbox"
            description="A box the user ticks to turn one option on or off."
          />
          <Preview className="min-h-60">
            <Field orientation="horizontal" className="w-auto">
              <Checkbox id="checkbox-preview" defaultChecked />
              <FieldLabel htmlFor="checkbox-preview">
                Send me release notes
              </FieldLabel>
            </Field>
          </Preview>
        </div>

        <Example
          title="With Label"
          description={
            <>
              Wrap the checkbox and its label in a horizontal{" "}
              <code>Field</code>. The label keeps the click target large.
            </>
          }
        >
          <Field orientation="horizontal" className="w-auto">
            <Checkbox id="checkbox-terms" />
            <FieldLabel htmlFor="checkbox-terms">
              I accept the terms
            </FieldLabel>
          </Field>
        </Example>

        <Example
          title="States"
          description={
            <>
              Set <code>defaultChecked</code>, <code>disabled</code>, or{" "}
              <code>{'checked="indeterminate"'}</code>.
            </>
          }
        >
          <Field orientation="horizontal" className="w-auto">
            <Checkbox id="checkbox-off" />
            <FieldLabel htmlFor="checkbox-off">Off</FieldLabel>
          </Field>
          <Field orientation="horizontal" className="w-auto">
            <Checkbox id="checkbox-on" defaultChecked />
            <FieldLabel htmlFor="checkbox-on">On</FieldLabel>
          </Field>
          <Field orientation="horizontal" className="w-auto" data-disabled>
            <Checkbox id="checkbox-disabled" disabled />
            <FieldLabel htmlFor="checkbox-disabled">Disabled</FieldLabel>
          </Field>
        </Example>

        <Example
          title="Group"
          description={
            <>
              Group related checkboxes in a <code>FieldSet</code> with a{" "}
              <code>FieldLegend</code>.
            </>
          }
        >
          <FieldSet className="w-full max-w-sm">
            <FieldLegend>Email me about</FieldLegend>
            <FieldGroup className="gap-3">
              <Field orientation="horizontal">
                <Checkbox id="checkbox-deploys" defaultChecked />
                <FieldLabel htmlFor="checkbox-deploys">Deployments</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="checkbox-comments" />
                <FieldLabel htmlFor="checkbox-comments">Comments</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="checkbox-billing" />
                <FieldLabel htmlFor="checkbox-billing">Billing</FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
        </Example>

        <Example
          title="Invalid"
          description={
            <>
              Set <code>data-invalid</code> on the <code>Field</code> and{" "}
              <code>aria-invalid</code> on the checkbox.
            </>
          }
        >
          <Field data-invalid className="w-full max-w-sm">
            <Field orientation="horizontal">
              <Checkbox id="checkbox-invalid" aria-invalid />
              <FieldLabel htmlFor="checkbox-invalid">
                I accept the terms
              </FieldLabel>
            </Field>
            <FieldDescription>You have to accept to continue.</FieldDescription>
          </Field>
        </Example>
      </DashboardContainer>
    </>
  )
}
