/* Context Menu docs with a preview for each kind of item */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Context Menu",
  description: "A menu that opens where the user right clicks.",
}

export default function ContextMenuPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Context Menu" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Context Menu"
            description="A menu that opens where the user right clicks."
          />
          <Preview className="min-h-60">
            <ContextMenu>
              <ContextMenuTrigger className="flex h-32 w-full max-w-sm items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                Right click here
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuGroup>
                  <ContextMenuItem>
                    Open
                    <ContextMenuShortcut>⌘O</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem>
                    Rename
                    <ContextMenuShortcut>F2</ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuGroup>
                <ContextMenuSeparator />
                <ContextMenuGroup>
                  <ContextMenuItem variant="destructive">
                    Delete
                  </ContextMenuItem>
                </ContextMenuGroup>
              </ContextMenuContent>
            </ContextMenu>
          </Preview>
        </div>

        <Example
          title="When to Use"
          description={
            <>
              Use it for extra actions on an item in a list or a canvas. Give
              the same actions somewhere visible too, because a right click is
              hard to discover and is not available on a touch screen.
            </>
          }
        >
          <ContextMenu>
            <ContextMenuTrigger className="flex h-24 w-full max-w-sm items-center justify-center rounded-lg border text-sm text-muted-foreground">
              A file row
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuGroup>
                <ContextMenuItem>Download</ContextMenuItem>
                <ContextMenuItem>Copy link</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        </Example>

        <Example
          title="Checkbox and Radio Items"
          description={
            <>
              Use <code>ContextMenuCheckboxItem</code> for options that switch
              on and off, and <code>ContextMenuRadioGroup</code> when one option
              wins.
            </>
          }
        >
          <ContextMenu>
            <ContextMenuTrigger className="flex h-24 w-full max-w-sm items-center justify-center rounded-lg border text-sm text-muted-foreground">
              Right click for view options
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuGroup>
                <ContextMenuLabel>Show</ContextMenuLabel>
                <ContextMenuCheckboxItem defaultChecked>
                  Hidden files
                </ContextMenuCheckboxItem>
                <ContextMenuCheckboxItem>File size</ContextMenuCheckboxItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuRadioGroup defaultValue="grid">
                <ContextMenuLabel>Layout</ContextMenuLabel>
                <ContextMenuRadioItem value="list">List</ContextMenuRadioItem>
                <ContextMenuRadioItem value="grid">Grid</ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuContent>
          </ContextMenu>
        </Example>

        <Example
          title="Submenu"
          description={
            <>
              Nest a <code>ContextMenuSub</code> for a second level of actions.
            </>
          }
        >
          <ContextMenu>
            <ContextMenuTrigger className="flex h-24 w-full max-w-sm items-center justify-center rounded-lg border text-sm text-muted-foreground">
              Right click to share
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuGroup>
                <ContextMenuItem>Open</ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem>Copy link</ContextMenuItem>
                    <ContextMenuItem>Email</ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuItem disabled>Move, not available</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        </Example>
      </DashboardContainer>
    </>
  )
}
