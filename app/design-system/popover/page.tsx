/* Popover docs with a preview for each position */
import type { Metadata } from "next"
import { Settings2 } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Popover",
  description: "A small panel anchored to the control that opens it.",
}

export default function PopoverPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Popover" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Popover"
            description="A small panel anchored to the control that opens it."
          />
          <Preview className="min-h-60">
            <Popover>
              <PopoverTrigger render={<Button variant="outline" />}>
                <Settings2 data-icon="inline-start" />
                Display
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <PopoverHeader>
                  <PopoverTitle>Display</PopoverTitle>
                  <PopoverDescription>
                    These settings apply to this view only.
                  </PopoverDescription>
                </PopoverHeader>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="popover-rows">Rows</FieldLabel>
                    <Input id="popover-rows" type="number" defaultValue={25} />
                  </Field>
                </FieldGroup>
              </PopoverContent>
            </Popover>
          </Preview>
        </div>

        <Example
          title="Side"
          description={
            <>
              Set <code>side</code> to <code>top</code>, <code>right</code>,{" "}
              <code>bottom</code>, or <code>left</code>. The default is{" "}
              <code>bottom</code>.
            </>
          }
        >
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Popover key={side}>
              <PopoverTrigger render={<Button variant="outline" size="sm" />}>
                {side}
              </PopoverTrigger>
              <PopoverContent side={side}>
                <PopoverTitle>Side {side}</PopoverTitle>
              </PopoverContent>
            </Popover>
          ))}
        </Example>

        <Example
          title="Align"
          description={
            <>
              Set <code>align</code> to <code>start</code>, <code>center</code>,
              or <code>end</code>. Use <code>sideOffset</code> to change the
              gap.
            </>
          }
        >
          {(["start", "center", "end"] as const).map((align) => (
            <Popover key={align}>
              <PopoverTrigger render={<Button variant="outline" size="sm" />}>
                {align}
              </PopoverTrigger>
              <PopoverContent align={align} sideOffset={8}>
                <PopoverTitle>Align {align}</PopoverTitle>
              </PopoverContent>
            </Popover>
          ))}
        </Example>

        <Example
          title="Header"
          description={
            <>
              Use <code>PopoverHeader</code> with <code>PopoverTitle</code> and{" "}
              <code>PopoverDescription</code> to name the panel.
            </>
          }
        >
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
              About this build
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <PopoverHeader>
                <PopoverTitle>Build 421</PopoverTitle>
                <PopoverDescription>
                  Started two minutes ago from the main branch.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </Example>
      </DashboardContainer>
    </>
  )
}
