/* Slider docs with a preview for each range and orientation */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Slider",
  description: "A track the user drags to pick a number.",
}

export default function SliderPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Slider" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Slider"
            description="A track the user drags to pick a number."
          />
          <Preview className="min-h-60">
            <Slider defaultValue={[40]} className="max-w-sm" />
          </Preview>
        </div>

        <Example
          title="Value"
          description={
            <>
              Pass <code>defaultValue</code> as an array. One number gives one
              thumb.
            </>
          }
        >
          <div className="flex w-full max-w-sm flex-col gap-8">
            <Slider defaultValue={[20]} />
            <Slider defaultValue={[75]} />
          </div>
        </Example>

        <Example
          title="Range"
          description={
            <>
              Pass two numbers for a range. Set <code>min</code>,{" "}
              <code>max</code>, and <code>step</code> to limit the values.
            </>
          }
        >
          <Slider
            defaultValue={[20, 60]}
            min={0}
            max={100}
            step={5}
            className="max-w-sm"
          />
        </Example>

        <Example
          title="Vertical"
          description={
            <>
              Set <code>{'orientation="vertical"'}</code>. The parent needs a
              height.
            </>
          }
        >
          <div className="h-40">
            <Slider orientation="vertical" defaultValue={[60]} />
          </div>
        </Example>

        <Example
          title="Disabled and Labelled"
          description={
            <>
              Set <code>disabled</code> to lock the slider. In a form, put it in
              a <code>Field</code> so it has a label.
            </>
          }
        >
          <div className="flex w-full max-w-sm flex-col gap-8">
            <Field>
              <FieldLabel htmlFor="slider-quality">Quality</FieldLabel>
              <Slider id="slider-quality" defaultValue={[70]} />
              <FieldDescription>
                A higher value makes a larger file.
              </FieldDescription>
            </Field>
            <Slider defaultValue={[30]} disabled />
          </div>
        </Example>
      </DashboardContainer>
    </>
  )
}
