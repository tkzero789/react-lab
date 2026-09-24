/* Bubble docs with a preview for each variant and alignment */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Bubble",
  description: "The surface of one message in a conversation.",
}

export default function BubblePage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Bubble" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Bubble"
            description="The surface of one message in a conversation."
          />
          <Preview className="min-h-60">
            <BubbleGroup className="w-full max-w-sm">
              <Bubble variant="secondary">
                <BubbleContent>
                  Can you deploy the fix to production?
                </BubbleContent>
              </Bubble>
              <Bubble align="end">
                <BubbleContent>It is live now.</BubbleContent>
              </Bubble>
            </BubbleGroup>
          </Preview>
        </div>

        <Example
          title="Alignment"
          description={
            <>
              Set <code>{'align="end"'}</code> for the message of the current
              user. The default is <code>start</code>.
            </>
          }
        >
          <BubbleGroup className="w-full max-w-sm">
            <Bubble variant="secondary">
              <BubbleContent>From them</BubbleContent>
            </Bubble>
            <Bubble align="end">
              <BubbleContent>From you</BubbleContent>
            </Bubble>
          </BubbleGroup>
        </Example>

        <Example
          title="Variant"
          description={
            <>
              Set <code>variant</code> on the bubble, not on the content. The
              variant styles the content through the data attribute.
            </>
          }
        >
          <BubbleGroup className="w-full max-w-sm">
            {(
              [
                "default",
                "secondary",
                "tinted",
                "outline",
                "ghost",
                "destructive",
              ] as const
            ).map((variant) => (
              <Bubble key={variant} variant={variant}>
                <BubbleContent>{variant}</BubbleContent>
              </Bubble>
            ))}
          </BubbleGroup>
        </Example>

        <Example
          title="Reactions"
          description={
            <>
              Add <code>BubbleReactions</code> inside the bubble. Set{" "}
              <code>side</code> and <code>align</code> to place it on the edge.
            </>
          }
        >
          <BubbleGroup className="w-full max-w-sm pb-4">
            <Bubble variant="secondary">
              <BubbleContent>The design is ready for review.</BubbleContent>
              <BubbleReactions side="bottom" align="start">
                👍 2
              </BubbleReactions>
            </Bubble>
          </BubbleGroup>
        </Example>

        <Example
          title="As a Button"
          description={
            <>
              Set <code>render</code> on <code>BubbleContent</code> to make the
              surface a button or a link, for a message that can be pressed.
            </>
          }
        >
          <BubbleGroup className="w-full max-w-sm">
            <Bubble variant="outline">
              <BubbleContent render={<button type="button" />}>
                Retry the failed message
              </BubbleContent>
            </Bubble>
          </BubbleGroup>
        </Example>
      </DashboardContainer>
    </>
  )
}
