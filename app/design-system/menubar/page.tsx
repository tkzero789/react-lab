/* Menubar docs with a preview for each menu and item */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Menubar",
  description: "A row of menus, like the menu bar of a desktop app.",
}

export default function MenubarPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Menubar" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Menubar"
            description="A row of menus, like the menu bar of a desktop app."
          />
          <Preview className="min-h-60">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                  <MenubarGroup>
                    <MenubarItem>
                      New file
                      <MenubarShortcut>⌘N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                      Open
                      <MenubarShortcut>⌘O</MenubarShortcut>
                    </MenubarItem>
                  </MenubarGroup>
                  <MenubarSeparator />
                  <MenubarGroup>
                    <MenubarItem variant="destructive">Delete</MenubarItem>
                  </MenubarGroup>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                  <MenubarGroup>
                    <MenubarItem>Undo</MenubarItem>
                    <MenubarItem>Redo</MenubarItem>
                  </MenubarGroup>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                  <MenubarGroup>
                    <MenubarCheckboxItem defaultChecked>
                      Show sidebar
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem>Show terminal</MenubarCheckboxItem>
                  </MenubarGroup>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </Preview>
        </div>

        <Example
          title="When to Use"
          description={
            <>
              Use it for an app with many commands, such as an editor. For one
              button with a few actions, use a <code>DropdownMenu</code>.
            </>
          }
        >
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>Project</MenubarTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarItem>Settings</MenubarItem>
                  <MenubarItem>Members</MenubarItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </Example>

        <Example
          title="Radio Items"
          description={
            <>
              Wrap <code>MenubarRadioItem</code> in a{" "}
              <code>MenubarRadioGroup</code>, and name the set with{" "}
              <code>MenubarLabel</code>.
            </>
          }
        >
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>Theme</MenubarTrigger>
              <MenubarContent>
                <MenubarRadioGroup defaultValue="system">
                  <MenubarLabel>Appearance</MenubarLabel>
                  <MenubarRadioItem value="light">Light</MenubarRadioItem>
                  <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
                  <MenubarRadioItem value="system">System</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </Example>

        <Example
          title="Submenu"
          description={
            <>
              Nest a <code>MenubarSub</code> for a second level, the same as the
              dropdown menu.
            </>
          }
        >
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>Share</MenubarTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarItem>Copy link</MenubarItem>
                  <MenubarSub>
                    <MenubarSubTrigger>Send to</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>Email</MenubarItem>
                      <MenubarItem>Slack</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </Example>
      </DashboardContainer>
    </>
  )
}
