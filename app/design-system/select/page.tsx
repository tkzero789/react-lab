/* Select docs with a preview for each size and grouping */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Select",
  description: "A list of options in a panel, picked one at a time.",
}

export default function SelectPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Select" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Select"
            description="A list of options in a panel, picked one at a time."
          />
          <Preview className="min-h-60">
            <Select defaultValue="production">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Pick an environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="preview">Preview</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Preview>
        </div>

        <Example
          title="Placeholder"
          description={
            <>
              Leave out <code>defaultValue</code> and set{" "}
              <code>placeholder</code> on <code>SelectValue</code>.
            </>
          }
        >
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pick a region" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="fra">Frankfurt</SelectItem>
                <SelectItem value="sin">Singapore</SelectItem>
                <SelectItem value="iad">Washington</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Example>

        <Example
          title="Size"
          description={
            <>
              Set <code>{'size="sm"'}</code> on <code>SelectTrigger</code>. Omit
              it for the default height.
            </>
          }
        >
          <Select defaultValue="25">
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="25">25 rows</SelectItem>
                <SelectItem value="50">50 rows</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select defaultValue="25">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="25">25 rows</SelectItem>
                <SelectItem value="50">50 rows</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Example>

        <Example
          title="Groups"
          description={
            <>
              Every <code>SelectItem</code> belongs in a{" "}
              <code>SelectGroup</code>. Name each group with{" "}
              <code>SelectLabel</code> and divide them with{" "}
              <code>SelectSeparator</code>.
            </>
          }
        >
          <Select defaultValue="lon">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Europe</SelectLabel>
                <SelectItem value="lon">London</SelectItem>
                <SelectItem value="ber">Berlin</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Asia</SelectLabel>
                <SelectItem value="sgn">Ho Chi Minh</SelectItem>
                <SelectItem value="sin">Singapore</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Example>

        <Example
          title="In a Field"
          description={
            <>
              Put the select in a <code>Field</code>. Set{" "}
              <code>disabled</code> on <code>Select</code> to lock the value.
            </>
          }
        >
          <FieldGroup className="max-w-sm">
            <Field>
              <FieldLabel>Visibility</FieldLabel>
              <Select defaultValue="private">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field data-disabled>
              <FieldLabel>Plan</FieldLabel>
              <Select defaultValue="free" disabled>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="free">Free</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </Example>
      </DashboardContainer>
    </>
  )
}
