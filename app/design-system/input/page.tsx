/* Input docs with a preview for each type and state */
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
import { Input } from "@/components/ui/input"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Input",
  description: "A single line box for text.",
}

export default function InputPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Input" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader title="Input" description="A single line box for text." />
          <Preview className="min-h-60">
            <Input
              className="max-w-sm"
              placeholder="name@example.com"
              type="email"
            />
          </Preview>
        </div>

        <Example
          title="With Label"
          description={
            <>
              Wrap the input in a <code>Field</code> and point{" "}
              <code>FieldLabel</code> at its id.
            </>
          }
        >
          <FieldGroup className="max-w-sm">
            <Field>
              <FieldLabel htmlFor="input-email">Email</FieldLabel>
              <Input
                id="input-email"
                type="email"
                placeholder="name@example.com"
              />
            </Field>
          </FieldGroup>
        </Example>

        <Example
          title="Type"
          description={
            <>
              Set <code>type</code> so the browser shows the right keyboard and
              controls.
            </>
          }
        >
          <FieldGroup className="max-w-sm">
            <Field>
              <FieldLabel htmlFor="input-password">Password</FieldLabel>
              <Input id="input-password" type="password" />
            </Field>
            <Field>
              <FieldLabel htmlFor="input-number">Seats</FieldLabel>
              <Input id="input-number" type="number" defaultValue={3} min={1} />
            </Field>
            <Field>
              <FieldLabel htmlFor="input-file">Avatar</FieldLabel>
              <Input id="input-file" type="file" />
            </Field>
          </FieldGroup>
        </Example>

        <Example
          title="Disabled and Read Only"
          description={
            <>
              Use <code>disabled</code> when the value cannot change, and{" "}
              <code>readOnly</code> when it can be copied but not edited.
            </>
          }
        >
          <FieldGroup className="max-w-sm">
            <Field data-disabled>
              <FieldLabel htmlFor="input-disabled">Workspace</FieldLabel>
              <Input id="input-disabled" defaultValue="acme" disabled />
            </Field>
            <Field>
              <FieldLabel htmlFor="input-readonly">Project id</FieldLabel>
              <Input id="input-readonly" defaultValue="prj_8s12kd" readOnly />
            </Field>
          </FieldGroup>
        </Example>

        <Example
          title="Description and Error"
          description={
            <>
              Add <code>FieldDescription</code> for help text. For an error, set{" "}
              <code>data-invalid</code> on the <code>Field</code> and{" "}
              <code>aria-invalid</code> on the input.
            </>
          }
        >
          <FieldGroup className="max-w-sm">
            <Field>
              <FieldLabel htmlFor="input-slug">Project name</FieldLabel>
              <Input id="input-slug" defaultValue="my-app" />
              <FieldDescription>
                Lower case letters, numbers, and dashes only.
              </FieldDescription>
            </Field>
            <Field data-invalid>
              <FieldLabel htmlFor="input-invalid">Project name</FieldLabel>
              <Input id="input-invalid" defaultValue="My App!" aria-invalid />
              <FieldError>Use lower case letters and dashes.</FieldError>
            </Field>
          </FieldGroup>
        </Example>
      </DashboardContainer>
    </>
  )
}
