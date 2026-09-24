/* Message docs with a preview for each row layout */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Message",
  description: "One row in a conversation, with its avatar and bubbles.",
}

export default function MessagePage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Message" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Message"
            description="One row in a conversation, with its avatar and bubbles."
          />
          <Preview className="min-h-60">
            <MessageGroup className="w-full max-w-sm">
              <Message>
                <MessageAvatar>
                  <Avatar size="sm">
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                </MessageAvatar>
                <MessageContent>
                  <Bubble variant="secondary">
                    <BubbleContent>
                      The new deploy is ready for review.
                    </BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
              <Message align="end">
                <MessageContent>
                  <Bubble align="end">
                    <BubbleContent>Looks good, ship it.</BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            </MessageGroup>
          </Preview>
        </div>

        <Example
          title="Alignment"
          description={
            <>
              Set <code>{'align="end"'}</code> on <code>Message</code> for the
              current user. The row reverses, so the avatar moves to the right.
            </>
          }
        >
          <MessageGroup className="w-full max-w-sm">
            <Message>
              <MessageAvatar>
                <Avatar size="sm">
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
              </MessageAvatar>
              <MessageContent>
                <Bubble variant="secondary">
                  <BubbleContent>From them</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
            <Message align="end">
              <MessageAvatar>
                <Avatar size="sm">
                  <AvatarFallback>TT</AvatarFallback>
                </Avatar>
              </MessageAvatar>
              <MessageContent>
                <Bubble align="end">
                  <BubbleContent>From you</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          </MessageGroup>
        </Example>

        <Example
          title="Header and Footer"
          description={
            <>
              Use <code>MessageHeader</code> for the name, and{" "}
              <code>MessageFooter</code> for the time or the state. The avatar
              lifts itself when a footer is present.
            </>
          }
        >
          <MessageGroup className="w-full max-w-sm">
            <Message>
              <MessageAvatar>
                <Avatar size="sm">
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>Anna Bell</MessageHeader>
                <Bubble variant="secondary">
                  <BubbleContent>
                    I pushed the fix to the branch.
                  </BubbleContent>
                </Bubble>
                <MessageFooter>09:41</MessageFooter>
              </MessageContent>
            </Message>
          </MessageGroup>
        </Example>

        <Example
          title="Several Bubbles"
          description={
            <>
              Put more than one bubble in <code>MessageContent</code> for
              messages sent together.
            </>
          }
        >
          <MessageGroup className="w-full max-w-sm">
            <Message align="end">
              <MessageContent>
                <Bubble align="end">
                  <BubbleContent>One moment.</BubbleContent>
                </Bubble>
                <Bubble align="end">
                  <BubbleContent>I am reading the log now.</BubbleContent>
                </Bubble>
                <MessageFooter>Sent</MessageFooter>
              </MessageContent>
            </Message>
          </MessageGroup>
        </Example>
      </DashboardContainer>
    </>
  )
}
