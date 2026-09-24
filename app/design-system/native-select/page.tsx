/* Native Select docs with a preview for each size and width */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Native Select",
  description: "The select of the browser, styled to match the other inputs.",
}

export default function NativeSelectPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Native Select" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Native Select"
            description="The select of the browser, styled to match the other inputs."
          />
          <Preview className="min-h-60">
            <NativeSelect defaultValue="production">
              <NativeSelectOption value="production">
                Production
              </NativeSelectOption>
              <NativeSelectOption value="preview">Preview</NativeSelectOption>
              <NativeSelectOption value="development">
                Development
              </NativeSelectOption>
            </NativeSelect>
          </Preview>
        </div>

        <Example
          title="When to Use"
          description={
            <>
              Use this on a small screen, or for a long plain list, because the
              browser opens its own picker. Use <code>Select</code> when the
              options need icons or custom rows.
            </>
          }
        >
          <NativeSelect defaultValue="uk">
            <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
            <NativeSelectOption value="de">Germany</NativeSelectOption>
            <NativeSelectOption value="vn">Vietnam</NativeSelectOption>
          </NativeSelect>
        </Example>

        <Example
          title="Size and Width"
          description={
            <>
              Set <code>{'size="sm"'}</code> for a shorter control, and{" "}
              <code>{'width="full"'}</code> to fill the parent.
            </>
          }
        >
          <div className="flex w-full max-w-sm flex-col gap-4">
            <NativeSelect size="sm" defaultValue="10">
              <NativeSelectOption value="10">10 per page</NativeSelectOption>
              <NativeSelectOption value="25">25 per page</NativeSelectOption>
            </NativeSelect>
            <NativeSelect width="full" defaultValue="cet">
              <NativeSelectOption value="cet">
                Central European Time
              </NativeSelectOption>
              <NativeSelectOption value="ict">
                Indochina Time
              </NativeSelectOption>
            </NativeSelect>
          </div>
        </Example>

        <Example
          title="Groups"
          description={
            <>
              Use <code>NativeSelectOptGroup</code> with a <code>label</code> to
              sort long lists.
            </>
          }
        >
          <NativeSelect defaultValue="lon">
            <NativeSelectOptGroup label="Europe">
              <NativeSelectOption value="lon">London</NativeSelectOption>
              <NativeSelectOption value="ber">Berlin</NativeSelectOption>
            </NativeSelectOptGroup>
            <NativeSelectOptGroup label="Asia">
              <NativeSelectOption value="sgn">Ho Chi Minh</NativeSelectOption>
              <NativeSelectOption value="sin">Singapore</NativeSelectOption>
            </NativeSelectOptGroup>
          </NativeSelect>
        </Example>

        <Example
          title="With Label"
          description={
            <>
              Put it in a <code>Field</code>, the same as the other controls.
            </>
          }
        >
          <FieldGroup className="max-w-sm">
            <Field>
              <FieldLabel htmlFor="native-select-role">Role</FieldLabel>
              <NativeSelect id="native-select-role" width="full" disabled>
                <NativeSelectOption value="viewer">Viewer</NativeSelectOption>
              </NativeSelect>
            </Field>
          </FieldGroup>
        </Example>
      </DashboardContainer>
    </>
  )
}
