/* Dropdown Menu docs with a preview for each kind of item */
import type { Metadata } from "next"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Dropdown Menu",
  description: "A list of actions that opens from a button.",
}

export default function DropdownMenuPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Dropdown Menu" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Dropdown Menu"
            description="A list of actions that opens from a button."
          />
          <Preview className="min-h-60">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                Account
                <ChevronDown data-icon="inline-end" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-44">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User />
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <LogOut />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </Preview>
        </div>

        <Example
          title="Groups and Labels"
          description={
            <>
              Put items in a <code>DropdownMenuGroup</code> and name the group
              with <code>DropdownMenuLabel</code>.
            </>
          }
        >
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Open
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-44">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Project</DropdownMenuLabel>
                <DropdownMenuItem>Rename</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Danger</DropdownMenuLabel>
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Example>

        <Example
          title="Checkbox Items"
          description={
            <>
              Use <code>DropdownMenuCheckboxItem</code> for options the user can
              switch on and off.
            </>
          }
        >
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Columns
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-44">
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem defaultChecked>
                  Status
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem defaultChecked>
                  Created
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Owner</DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Example>

        <Example
          title="Radio Items"
          description={
            <>
              Wrap <code>DropdownMenuRadioItem</code> in a{" "}
              <code>DropdownMenuRadioGroup</code> when only one option applies.
            </>
          }
        >
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Sort
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-44">
              <DropdownMenuRadioGroup defaultValue="new">
                <DropdownMenuRadioItem value="new">
                  Newest first
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="old">
                  Oldest first
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Example>

        <Example
          title="Submenu"
          description={
            <>
              Nest a <code>DropdownMenuSub</code> with a{" "}
              <code>DropdownMenuSubTrigger</code> and{" "}
              <code>DropdownMenuSubContent</code>.
            </>
          }
        >
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Share
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-44">
              <DropdownMenuGroup>
                <DropdownMenuItem>Copy link</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Invite</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>By email</DropdownMenuItem>
                    <DropdownMenuItem>By username</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Example>

        <Example
          title="Position"
          description={
            <>
              Set <code>side</code>, <code>align</code>, and{" "}
              <code>sideOffset</code> on <code>DropdownMenuContent</code>. The
              default is <code>bottom</code> and <code>start</code>.
            </>
          }
        >
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Align end
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="min-w-44">
              <DropdownMenuGroup>
                <DropdownMenuItem>First</DropdownMenuItem>
                <DropdownMenuItem>Second</DropdownMenuItem>
                <DropdownMenuItem disabled>Disabled</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Example>
      </DashboardContainer>
    </>
  )
}
