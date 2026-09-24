/* Input Group docs with a preview for each addon position */
import type { Metadata } from "next"
import { CreditCard, Search, Send } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Input Group",
  description: "An input with an icon, text, or a button inside the border.",
}

export default function InputGroupPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Input Group" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Input Group"
            description="An input with an icon, text, or a button inside the border."
          />
          <Preview className="min-h-60">
            <InputGroup className="max-w-sm">
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput placeholder="Search projects" />
              <InputGroupAddon align="inline-end">
                <Kbd>⌘K</Kbd>
              </InputGroupAddon>
            </InputGroup>
          </Preview>
        </div>

        <Example
          title="Control"
          description={
            <>
              Use <code>InputGroupInput</code> or{" "}
              <code>InputGroupTextarea</code> inside the group. A plain{" "}
              <code>Input</code> draws its own border.
            </>
          }
        >
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <CreditCard />
            </InputGroupAddon>
            <InputGroupInput placeholder="Card number" inputMode="numeric" />
          </InputGroup>
        </Example>

        <Example
          title="Inline Addon"
          description={
            <>
              Set <code>{'align="inline-start"'}</code> or{" "}
              <code>{'align="inline-end"'}</code>. The start is the default.
            </>
          }
        >
          <div className="flex w-full max-w-sm flex-col gap-4">
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput placeholder="example.com" />
            </InputGroup>
            <InputGroup>
              <InputGroupInput placeholder="Amount" inputMode="decimal" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>USD</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </Example>

        <Example
          title="Button Inside"
          description={
            <>
              Use <code>InputGroupButton</code> in an addon. It drops the border
              and the shadow so it fits the group.
            </>
          }
        >
          <InputGroup className="max-w-sm">
            <InputGroupInput placeholder="Ask a question" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Send">
                <Send />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Example>

        <Example
          title="Block Addon"
          description={
            <>
              Set <code>{'align="block-start"'}</code> or{" "}
              <code>{'align="block-end"'}</code> to stack the addon above or
              below the control.
            </>
          }
        >
          <InputGroup className="max-w-sm">
            <InputGroupTextarea placeholder="Write a reply" />
            <InputGroupAddon align="block-end" className="border-t">
              <InputGroupText>Markdown is supported</InputGroupText>
              <InputGroupButton size="xs" className="ml-auto">
                Reply
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Example>
      </DashboardContainer>
    </>
  )
}
