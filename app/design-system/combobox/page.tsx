/* Combobox docs with a preview for each mode */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/components/ui/combobox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

const regions = [
  "Frankfurt",
  "London",
  "Singapore",
  "Sydney",
  "Washington",
]

export const metadata: Metadata = {
  title: "Combobox",
  description: "An input that filters a list of options as the user types.",
}

export default function ComboboxPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Combobox" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Combobox"
            description="An input that filters a list of options as the user types."
          />
          <Preview className="min-h-60">
            <Combobox items={regions}>
              <ComboboxInput
                placeholder="Pick a region"
                className="w-full max-w-sm"
              />
              <ComboboxContent>
                <ComboboxEmpty>No region found.</ComboboxEmpty>
                <ComboboxList>
                  {regions.map((region) => (
                    <ComboboxItem key={region} value={region}>
                      {region}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Preview>
        </div>

        <Example
          title="When to Use"
          description={
            <>
              Use a combobox for a long list the user filters by typing. Use{" "}
              <code>Select</code> for a short fixed list.
            </>
          }
        >
          <Combobox items={regions}>
            <ComboboxInput placeholder="Search" className="w-full max-w-sm" />
            <ComboboxContent>
              <ComboboxEmpty>Nothing matches.</ComboboxEmpty>
              <ComboboxList>
                {regions.map((region) => (
                  <ComboboxItem key={region} value={region}>
                    {region}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Example>

        <Example
          title="Groups"
          description={
            <>
              Wrap the items in a <code>ComboboxGroup</code> and name it with{" "}
              <code>ComboboxLabel</code>.
            </>
          }
        >
          <Combobox items={regions}>
            <ComboboxInput placeholder="Pick a region" className="w-full max-w-sm" />
            <ComboboxContent>
              <ComboboxEmpty>No region found.</ComboboxEmpty>
              <ComboboxList>
                <ComboboxGroup>
                  <ComboboxLabel>Europe</ComboboxLabel>
                  <ComboboxItem value="Frankfurt">Frankfurt</ComboboxItem>
                  <ComboboxItem value="London">London</ComboboxItem>
                </ComboboxGroup>
                <ComboboxGroup>
                  <ComboboxLabel>Asia Pacific</ComboboxLabel>
                  <ComboboxItem value="Singapore">Singapore</ComboboxItem>
                  <ComboboxItem value="Sydney">Sydney</ComboboxItem>
                </ComboboxGroup>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Example>

        <Example
          title="Clear Button"
          description={
            <>
              Set <code>showClear</code> on <code>ComboboxInput</code> to add a
              button that empties the value.
            </>
          }
        >
          <Combobox items={regions} defaultValue="London">
            <ComboboxInput showClear className="w-full max-w-sm" />
            <ComboboxContent>
              <ComboboxEmpty>No region found.</ComboboxEmpty>
              <ComboboxList>
                {regions.map((region) => (
                  <ComboboxItem key={region} value={region}>
                    {region}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Example>

        <Example
          title="In a Field"
          description={
            <>
              Put it in a <code>Field</code> so it has a label, the same as the
              other controls.
            </>
          }
        >
          <FieldGroup className="max-w-sm">
            <Field>
              <FieldLabel>Region</FieldLabel>
              <Combobox items={regions}>
                <ComboboxInput placeholder="Pick a region" className="w-full" />
                <ComboboxContent>
                  <ComboboxEmpty>No region found.</ComboboxEmpty>
                  <ComboboxList>
                    {regions.map((region) => (
                      <ComboboxItem key={region} value={region}>
                        {region}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          </FieldGroup>
        </Example>
      </DashboardContainer>
    </>
  )
}
