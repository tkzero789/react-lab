/* Tooltip docs with a preview for each position and delay */
import type { Metadata } from "next"
import { Info, Plus } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Tooltip",
  description: "A short label that appears on hover or focus.",
}

export default function TooltipPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Tooltip" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Tooltip"
            description="A short label that appears on hover or focus."
          />
          <Preview className="min-h-60">
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="outline" size="icon" aria-label="Add" />}
              >
                <Plus />
              </TooltipTrigger>
              <TooltipContent>Add a project</TooltipContent>
            </Tooltip>
          </Preview>
        </div>

        <Example
          title="Side"
          description={
            <>
              Set <code>side</code> on <code>TooltipContent</code>. The arrow
              follows. The default is <code>top</code>.
            </>
          }
        >
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Tooltip key={side}>
              <TooltipTrigger render={<Button variant="outline" size="sm" />}>
                {side}
              </TooltipTrigger>
              <TooltipContent side={side}>Side {side}</TooltipContent>
            </Tooltip>
          ))}
        </Example>

        <Example
          title="With Shortcut"
          description={
            <>
              Put a <code>Kbd</code> in the tooltip to name the shortcut. The
              tooltip styles the key for its dark background.
            </>
          }
        >
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Search
            </TooltipTrigger>
            <TooltipContent>
              Open search
              <Kbd>⌘K</Kbd>
            </TooltipContent>
          </Tooltip>
        </Example>

        <Example
          title="Delay"
          description={
            <>
              Wrap a group in <code>TooltipProvider</code> and set{" "}
              <code>delay</code> in milliseconds. It is 0 by default.
            </>
          }
        >
          <TooltipProvider delay={600}>
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" />}>
                Hover and wait
              </TooltipTrigger>
              <TooltipContent>This waited 600ms</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Example>

        <Example
          title="On Text"
          description={
            <>
              The trigger can be any element. Keep the label short, and never
              put the only copy of important information in a tooltip.
            </>
          }
        >
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="inline-flex items-center gap-1 text-sm underline decoration-dotted underline-offset-4" />
              }
            >
              <Info className="size-3.5" />
              Quota
            </TooltipTrigger>
            <TooltipContent>Builds reset on the first of a month</TooltipContent>
          </Tooltip>
        </Example>
      </DashboardContainer>
    </>
  )
}
