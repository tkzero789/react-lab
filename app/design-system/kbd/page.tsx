/* Kbd docs with a preview for single keys and combinations */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Kbd",
  description: "A key on the keyboard, shown inside text or a control.",
}

export default function KbdPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Kbd" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Kbd"
            description="A key on the keyboard, shown inside text or a control."
          />
          <Preview className="min-h-60">
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </Preview>
        </div>

        <Example
          title="Single Key"
          description={<>Put one key in each <code>Kbd</code>.</>}
        >
          <Kbd>⏎</Kbd>
          <Kbd>Esc</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>?</Kbd>
        </Example>

        <Example
          title="Combination"
          description={
            <>
              Wrap several keys in <code>KbdGroup</code> for a shortcut.
            </>
          }
        >
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>⇧</Kbd>
            <Kbd>P</Kbd>
          </KbdGroup>
        </Example>

        <Example
          title="In a Button"
          description={
            <>
              The key sits next to the label and takes no pointer events.
            </>
          }
        >
          <Button variant="outline">
            Search
            <Kbd className="ml-2">⌘K</Kbd>
          </Button>
        </Example>

        <Example
          title="In Text"
          description={<>Use it inline to name a shortcut in a sentence.</>}
        >
          <p className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette.
          </p>
        </Example>
      </DashboardContainer>
    </>
  )
}
