/* Hover Card docs with a preview for each position */
import type { Metadata } from "next"
import Link from "next/link"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Hover Card",
  description: "A preview panel that opens when the pointer rests on a link.",
}

export default function HoverCardPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Hover Card" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Hover Card"
            description="A preview panel that opens when the pointer rests on a link."
          />
          <Preview className="min-h-60">
            <HoverCard>
              <HoverCardTrigger
                render={
                  <Link
                    href="/design-system"
                    className="text-sm underline underline-offset-4"
                  />
                }
              >
                @thinh
              </HoverCardTrigger>
              <HoverCardContent className="flex gap-3">
                <Avatar>
                  <AvatarFallback>TT</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Thinh Tran</span>
                  <span className="text-muted-foreground">
                    Builds small apps to learn React.
                  </span>
                </div>
              </HoverCardContent>
            </HoverCard>
          </Preview>
        </div>

        <Example
          title="When to Use"
          description={
            <>
              Use it for extra detail the user does not need, because it never
              opens on a touch screen. Use a <code>Popover</code> when the user
              must reach the content.
            </>
          }
        >
          <HoverCard>
            <HoverCardTrigger render={<Button variant="outline" />}>
              Build 421
            </HoverCardTrigger>
            <HoverCardContent className="flex flex-col gap-1">
              <span className="font-medium">Build 421</span>
              <span className="text-muted-foreground">
                Passed in 42 seconds on the main branch.
              </span>
            </HoverCardContent>
          </HoverCard>
        </Example>

        <Example
          title="Side"
          description={
            <>
              Set <code>side</code> and <code>align</code>, the same as a
              popover. The default is <code>bottom</code>.
            </>
          }
        >
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <HoverCard key={side}>
              <HoverCardTrigger render={<Button variant="outline" size="sm" />}>
                {side}
              </HoverCardTrigger>
              <HoverCardContent side={side} className="w-auto">
                Opens on the {side}
              </HoverCardContent>
            </HoverCard>
          ))}
        </Example>

        <Example
          title="Default Open"
          description={
            <>
              Set <code>defaultOpen</code> to show the card at once, which helps
              while you style it. Base UI holds the open delay itself, so there
              is no <code>delay</code> prop here.
            </>
          }
        >
          <HoverCard defaultOpen>
            <HoverCardTrigger render={<Button variant="outline" />}>
              Already open
            </HoverCardTrigger>
            <HoverCardContent className="w-auto">
              This card starts open
            </HoverCardContent>
          </HoverCard>
        </Example>
      </DashboardContainer>
    </>
  )
}
