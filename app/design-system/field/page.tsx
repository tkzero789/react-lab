/* Field docs with a preview for each layout and state */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Field",
  description: "The layout for a form control, its label, and its messages.",
}

export default function FieldPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Field" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Field"
            description="The layout for a form control, its label, and its messages."
          />
          <Preview className="min-h-60">
            <FieldGroup className="max-w-sm">
              <Field>
                <FieldLabel htmlFor="field-email">Email</FieldLabel>
                <Input id="field-email" type="email" placeholder="name@example.com" />
                <FieldDescription>
                  We only use this to send receipts.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </Preview>
        </div>

        <Example
          title="Group"
          description={
            <>
              Wrap the fields of a form in a <code>FieldGroup</code>. It sets
              the space between them, so never use{" "}
              <code>space-y-*</code> on a form.
            </>
          }
        >
          <FieldGroup className="max-w-sm">
            <Field>
              <FieldLabel htmlFor="field-first">First name</FieldLabel>
              <Input id="field-first" />
            </Field>
            <Field>
              <FieldLabel htmlFor="field-last">Last name</FieldLabel>
              <Input id="field-last" />
            </Field>
          </FieldGroup>
        </Example>

        <Example
          title="Orientation"
          description={
            <>
              Set <code>{'orientation="horizontal"'}</code> for a control next
              to its label, or <code>{'orientation="responsive"'}</code> to
              switch at the container width.
            </>
          }
        >
          <FieldGroup className="max-w-sm">
            <Field orientation="horizontal">
              <Switch id="field-switch" defaultChecked />
              <FieldLabel htmlFor="field-switch">Automatic deploys</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="field-checkbox" />
              <FieldLabel htmlFor="field-checkbox">
                Email me the result
              </FieldLabel>
            </Field>
          </FieldGroup>
        </Example>

        <Example
          title="Content"
          description={
            <>
              Use <code>FieldContent</code> when the label and description sit
              in a column beside the control.
            </>
          }
        >
          <Field orientation="horizontal" className="max-w-sm">
            <FieldContent>
              <FieldLabel htmlFor="field-protect">Protect production</FieldLabel>
              <FieldDescription>
                A deploy needs a review before it goes live.
              </FieldDescription>
            </FieldContent>
            <Switch id="field-protect" />
          </Field>
        </Example>

        <Example
          title="Set and Legend"
          description={
            <>
              Group related fields in a <code>FieldSet</code> with a{" "}
              <code>FieldLegend</code>. Set{" "}
              <code>{'variant="label"'}</code> for a smaller legend.
            </>
          }
        >
          <FieldSet className="max-w-sm">
            <FieldLegend variant="label">Notifications</FieldLegend>
            <FieldDescription>Pick what reaches your inbox.</FieldDescription>
            <FieldGroup className="gap-3">
              <Field orientation="horizontal">
                <Checkbox id="field-deploys" defaultChecked />
                <FieldLabel htmlFor="field-deploys">Deployments</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="field-comments" />
                <FieldLabel htmlFor="field-comments">Comments</FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
        </Example>

        <Example
          title="Invalid"
          description={
            <>
              Set <code>data-invalid</code> on the <code>Field</code> and{" "}
              <code>aria-invalid</code> on the control, then show the message
              with <code>FieldError</code>.
            </>
          }
        >
          <FieldGroup className="max-w-sm">
            <Field data-invalid>
              <FieldLabel htmlFor="field-invalid">Project name</FieldLabel>
              <Input id="field-invalid" defaultValue="My App!" aria-invalid />
              <FieldError>Use lower case letters and dashes.</FieldError>
            </Field>
          </FieldGroup>
        </Example>

        <Example
          title="Title and Separator"
          description={
            <>
              Use <code>FieldTitle</code> for a label with no control, and{" "}
              <code>FieldSeparator</code> to divide the sections of a long form.
            </>
          }
        >
          <FieldGroup className="max-w-sm">
            <Field>
              <FieldTitle>Account</FieldTitle>
              <FieldDescription>Your sign in details.</FieldDescription>
            </Field>
            <FieldSeparator>or</FieldSeparator>
            <Field>
              <FieldLabel htmlFor="field-team">Team name</FieldLabel>
              <Input id="field-team" />
            </Field>
          </FieldGroup>
        </Example>
      </DashboardContainer>
    </>
  )
}
