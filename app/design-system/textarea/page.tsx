/* Textarea docs with a preview for each state */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Textarea",
  description: "A box for text over several lines.",
}

export default function TextareaPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Textarea" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Textarea"
            description="A box for text over several lines."
          />
          <Preview className="min-h-60">
            <Textarea
              className="max-w-sm"
              placeholder="Tell us what went wrong"
            />
          </Preview>
        </div>

        <Example
          title="With Label"
          description={
            <>
              Wrap it in a <code>Field</code>, the same as an input.
            </>
          }
        >
          <FieldGroup className="max-w-sm">
            <Field>
              <FieldLabel htmlFor="textarea-message">Message</FieldLabel>
              <Textarea id="textarea-message" placeholder="Write a note" />
              <FieldDescription>
                The team answers within one working day.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </Example>

        <Example
          title="Auto Height"
          description={
            <>
              The box carries <code>field-sizing-content</code>, so it grows
              with the text. Set <code>rows</code> or a height class to stop
              that.
            </>
          }
        >
          <FieldGroup className="max-w-sm">
            <Field>
              <FieldLabel htmlFor="textarea-grow">Grows</FieldLabel>
              <Textarea
                id="textarea-grow"
                defaultValue={"Type more lines here.\nThe box follows."}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="textarea-fixed">Fixed height</FieldLabel>
              <Textarea id="textarea-fixed" className="h-24 field-sizing-fixed" />
            </Field>
          </FieldGroup>
        </Example>

        <Example
          title="Disabled and Invalid"
          description={
            <>
              Set <code>disabled</code>, or <code>aria-invalid</code> with{" "}
              <code>data-invalid</code> on the <code>Field</code>.
            </>
          }
        >
          <FieldGroup className="max-w-sm">
            <Field data-disabled>
              <FieldLabel htmlFor="textarea-disabled">Notes</FieldLabel>
              <Textarea id="textarea-disabled" disabled defaultValue="Locked" />
            </Field>
            <Field data-invalid>
              <FieldLabel htmlFor="textarea-invalid">Reason</FieldLabel>
              <Textarea id="textarea-invalid" aria-invalid />
              <FieldError>Give a reason before you continue.</FieldError>
            </Field>
          </FieldGroup>
        </Example>
      </DashboardContainer>
    </>
  )
}
