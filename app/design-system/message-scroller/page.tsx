/* Message Scroller docs with a preview of a scrolling conversation */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Marker, MarkerContent } from "@/components/ui/marker"
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

const conversation = Array.from({ length: 12 }, (_, index) => ({
  id: `m${index}`,
  fromMe: index % 3 === 0,
  text:
    index % 3 === 0
      ? `My message number ${index + 1}.`
      : `Their message number ${index + 1}, a little longer so the row wraps.`,
}))

export const metadata: Metadata = {
  title: "Message Scroller",
  description: "A scroll container for a conversation that follows new messages.",
}

export default function MessageScrollerPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Message Scroller" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Message Scroller"
            description="A scroll container for a conversation that follows new messages."
          />
          <Preview className="min-h-60">
            <MessageScrollerProvider>
              <MessageScroller className="h-72 w-full max-w-sm rounded-lg border">
                <MessageScrollerViewport className="p-3">
                  <MessageScrollerContent className="gap-3">
                    <MessageScrollerItem>
                      <Marker variant="separator">
                        <MarkerContent>Today</MarkerContent>
                      </Marker>
                    </MessageScrollerItem>
                    {conversation.map((message) => (
                      <MessageScrollerItem
                        key={message.id}
                        messageId={message.id}
                      >
                        <Message align={message.fromMe ? "end" : "start"}>
                          {message.fromMe ? null : (
                            <MessageAvatar>
                              <Avatar size="sm">
                                <AvatarFallback>AB</AvatarFallback>
                              </Avatar>
                            </MessageAvatar>
                          )}
                          <MessageContent>
                            <Bubble
                              align={message.fromMe ? "end" : "start"}
                              variant={message.fromMe ? "default" : "secondary"}
                            >
                              <BubbleContent>{message.text}</BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    ))}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </MessageScrollerProvider>
          </Preview>
        </div>

        <Example
          title="Structure"
          description={
            <>
              Wrap the view in <code>MessageScrollerProvider</code>, then nest{" "}
              <code>MessageScroller</code>, <code>MessageScrollerViewport</code>
              , and <code>MessageScrollerContent</code>. Each row is a{" "}
              <code>MessageScrollerItem</code>.
            </>
          }
        >
          <MessageScrollerProvider>
            <MessageScroller className="h-48 w-full max-w-sm rounded-lg border">
              <MessageScrollerViewport className="p-3">
                <MessageScrollerContent className="gap-3">
                  {conversation.slice(0, 6).map((message) => (
                    <MessageScrollerItem key={message.id}>
                      <Bubble
                        variant={message.fromMe ? "default" : "secondary"}
                        align={message.fromMe ? "end" : "start"}
                      >
                        <BubbleContent>{message.text}</BubbleContent>
                      </Bubble>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
            </MessageScroller>
          </MessageScrollerProvider>
        </Example>

        <Example
          title="Jump to Latest"
          description={
            <>
              Add <code>MessageScrollerButton</code> inside the scroller. It
              shows only when the user has scrolled away, and it hides itself
              again at the end.
            </>
          }
        >
          <MessageScrollerProvider>
            <MessageScroller className="h-48 w-full max-w-sm rounded-lg border">
              <MessageScrollerViewport className="p-3">
                <MessageScrollerContent className="gap-3">
                  {conversation.map((message) => (
                    <MessageScrollerItem key={message.id}>
                      <Bubble
                        variant={message.fromMe ? "default" : "secondary"}
                        align={message.fromMe ? "end" : "start"}
                      >
                        <BubbleContent>{message.text}</BubbleContent>
                      </Bubble>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>
        </Example>

        <Example
          title="Do Not Write Your Own"
          description={
            <>
              The scroller handles following a stream, keeping the anchor when
              the content grows, and the jump button. Do not build a{" "}
              <code>useStickToBottom</code> hook or a raw scroll container.
            </>
          }
        >
          <p className="text-sm text-muted-foreground">
            Use <code>useMessageScroller()</code> to scroll from code, and{" "}
            <code>useMessageScrollerVisibility()</code> to read what is on
            screen.
          </p>
        </Example>
      </DashboardContainer>
    </>
  )
}
