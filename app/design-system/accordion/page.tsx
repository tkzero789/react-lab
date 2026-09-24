/* Accordion docs with a preview for each behavior */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Accordion",
  description: "A stack of sections that each show or hide their content.",
}

export default function AccordionPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Accordion" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Accordion"
            description="A stack of sections that each show or hide their content."
          />
          <Preview className="min-h-60">
            <Accordion className="w-full max-w-md">
              <AccordionItem value="delivery">
                <AccordionTrigger>How long is delivery?</AccordionTrigger>
                <AccordionContent>
                  Orders leave the warehouse in one working day. Delivery takes
                  three to five days after that.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="returns">
                <AccordionTrigger>Can I return an item?</AccordionTrigger>
                <AccordionContent>
                  Send any unused item back within 30 days for a full refund.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="support">
                <AccordionTrigger>How do I contact support?</AccordionTrigger>
                <AccordionContent>
                  Write to support@example.com. The team answers within one
                  working day.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Preview>
        </div>

        <Example
          title="Single"
          description={
            <>
              Set <code>{"multiple={false}"}</code> so one open item closes the
              others.
            </>
          }
        >
          <Accordion multiple={false} className="w-full max-w-md">
            <AccordionItem value="one">
              <AccordionTrigger>First section</AccordionTrigger>
              <AccordionContent>
                Opening another section closes this one.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="two">
              <AccordionTrigger>Second section</AccordionTrigger>
              <AccordionContent>Only one section stays open.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Example>

        <Example
          title="Default Open"
          description={
            <>
              Set <code>defaultValue</code> to the values that start open.
            </>
          }
        >
          <Accordion defaultValue={["open"]} className="w-full max-w-md">
            <AccordionItem value="open">
              <AccordionTrigger>Open on load</AccordionTrigger>
              <AccordionContent>
                This section is open when the page renders.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="closed">
              <AccordionTrigger>Closed on load</AccordionTrigger>
              <AccordionContent>This section starts closed.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Example>

        <Example
          title="Disabled Item"
          description={
            <>
              Set <code>disabled</code> on an <code>AccordionItem</code> to stop
              it opening.
            </>
          }
        >
          <Accordion className="w-full max-w-md">
            <AccordionItem value="active">
              <AccordionTrigger>Available</AccordionTrigger>
              <AccordionContent>This section opens.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="locked" disabled>
              <AccordionTrigger>Not available</AccordionTrigger>
              <AccordionContent>You cannot see this content.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Example>
      </DashboardContainer>
    </>
  )
}
