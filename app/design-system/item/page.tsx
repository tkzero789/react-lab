/* Item docs with a preview for each variant, size, and part */
import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, FileText, Folder } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Item",
  description: "A row with media, text, and actions, for lists of records.",
}

export default function ItemPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Item" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Item"
            description="A row with media, text, and actions, for lists of records."
          />
          <Preview className="min-h-60">
            <Item variant="outline" className="max-w-md">
              <ItemMedia variant="icon">
                <Folder />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>design-system</ItemTitle>
                <ItemDescription>
                  Updated two hours ago by Thinh.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button size="sm" variant="outline">
                  Open
                </Button>
              </ItemActions>
            </Item>
          </Preview>
        </div>

        <Example
          title="Variant"
          description={
            <>
              Item uses the same color variants as Button. Omit{" "}
              <code>variant</code> for the brand style; use <code>ghost</code>{" "}
              for a plain row.
            </>
          }
        >
          <div className="flex w-full max-w-md flex-col gap-2">
            <Item>
              <ItemContent>
                <ItemTitle>Default</ItemTitle>
              </ItemContent>
            </Item>
            <Item variant="outline">
              <ItemContent>
                <ItemTitle>Outline</ItemTitle>
              </ItemContent>
            </Item>
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>Muted</ItemTitle>
              </ItemContent>
            </Item>
            <Item variant="ghost">
              <ItemContent>
                <ItemTitle>Ghost</ItemTitle>
              </ItemContent>
            </Item>
            <Item variant="destructive">
              <ItemContent>
                <ItemTitle>Destructive</ItemTitle>
              </ItemContent>
            </Item>
            <Item variant="ghost-destructive">
              <ItemContent>
                <ItemTitle>Ghost Destructive</ItemTitle>
              </ItemContent>
            </Item>
            <Item variant="link" render={<Link href="/design-system/button" />}>
              <ItemContent>
                <ItemTitle>Link</ItemTitle>
              </ItemContent>
            </Item>
            <Item variant="input">
              <ItemContent>
                <ItemTitle>Input</ItemTitle>
              </ItemContent>
            </Item>
          </div>
        </Example>

        <Example
          title="Size"
          description={
            <>
              Set <code>{'size="sm"'}</code> or <code>{'size="xs"'}</code> for
              tighter rows. The media shrinks with the row.
            </>
          }
        >
          <div className="flex w-full max-w-md flex-col gap-2">
            <Item variant="outline" size="xs">
              <ItemMedia variant="icon">
                <FileText />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>readme.md</ItemTitle>
              </ItemContent>
            </Item>
            <Item variant="outline" size="sm">
              <ItemMedia variant="icon">
                <FileText />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>package.json</ItemTitle>
              </ItemContent>
            </Item>
          </div>
        </Example>

        <Example
          title="Group"
          description={
            <>
              Wrap rows in an <code>ItemGroup</code>, and divide them with{" "}
              <code>ItemSeparator</code> when they share a border.
            </>
          }
        >
          <ItemGroup className="max-w-md rounded-lg border p-2">
            <Item variant="ghost">
              <ItemMedia>
                <Avatar size="sm">
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Anna Bell</ItemTitle>
                <ItemDescription>Owner</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="muted">Admin</Badge>
              </ItemActions>
            </Item>
            <ItemSeparator />
            <Item variant="ghost">
              <ItemMedia>
                <Avatar size="sm">
                  <AvatarFallback>CD</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Chris Doe</ItemTitle>
                <ItemDescription>Invited yesterday</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="outline">Pending</Badge>
              </ItemActions>
            </Item>
          </ItemGroup>
        </Example>

        <Example
          title="As a Link"
          description={
            <>
              Set <code>{"render={<Link href=\"/\" />}"}</code> to make the whole
              row a link. Add <code>pressable</code> for press feedback.
            </>
          }
        >
          <Item
            variant="outline"
            pressable
            className="max-w-md"
            render={<Link href="/design-system" />}
          >
            <ItemContent>
              <ItemTitle>Back to the design system</ItemTitle>
              <ItemDescription>Every component in one list.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRight className="size-4 text-muted-foreground" />
            </ItemActions>
          </Item>
        </Example>
      </DashboardContainer>
    </>
  )
}
