/* Command docs with a preview for the inline list and the dialog */
import type { Metadata } from "next"
import { Calendar, Rocket, Settings, User } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"
import CommandDialogDemo from "./command-dialog-demo"

export const metadata: Metadata = {
  title: "Command",
  description: "A list of commands that filters as the user types.",
}

export default function CommandPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Command" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Command"
            description="A list of commands that filters as the user types."
          />
          <Preview className="min-h-60">
            <Command className="w-full max-w-sm rounded-lg border">
              <CommandInput placeholder="Type to search" />
              <CommandList>
                <CommandEmpty>No result.</CommandEmpty>
                <CommandGroup heading="Go to">
                  <CommandItem>
                    <Rocket />
                    Deployments
                  </CommandItem>
                  <CommandItem>
                    <Calendar />
                    Schedule
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Account">
                  <CommandItem>
                    <User />
                    Profile
                    <CommandShortcut>⇧⌘P</CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    <Settings />
                    Settings
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </Preview>
        </div>

        <Example
          title="In a Dialog"
          description={
            <>
              Use <code>CommandDialog</code> for a palette over the page. It
              needs <code>open</code> and <code>onOpenChange</code>, so put it
              in a client component.
            </>
          }
        >
          <CommandDialogDemo />
        </Example>

        <Example
          title="Groups"
          description={
            <>
              Every <code>CommandItem</code> belongs in a{" "}
              <code>CommandGroup</code>. Name the group with{" "}
              <code>heading</code>.
            </>
          }
        >
          <Command className="w-full max-w-sm rounded-lg border">
            <CommandList>
              <CommandGroup heading="Recent">
                <CommandItem>my-app</CommandItem>
                <CommandItem>docs-site</CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="All projects">
                <CommandItem>billing-api</CommandItem>
                <CommandItem>design-system</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </Example>

        <Example
          title="Empty State"
          description={
            <>
              <code>CommandEmpty</code> shows when nothing matches what the user
              typed.
            </>
          }
        >
          <Command className="w-full max-w-sm rounded-lg border">
            <CommandInput defaultValue="zzz" placeholder="Type to search" />
            <CommandList>
              <CommandEmpty>No project matches.</CommandEmpty>
              <CommandGroup heading="Projects">
                <CommandItem>my-app</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </Example>

        <Example
          title="Shortcut"
          description={
            <>
              Put a <code>CommandShortcut</code> at the end of an item to name
              its keyboard shortcut.
            </>
          }
        >
          <Command className="w-full max-w-sm rounded-lg border">
            <CommandList>
              <CommandGroup heading="Actions">
                <CommandItem>
                  New project
                  <CommandShortcut>⌘N</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  Search
                  <CommandShortcut>⌘K</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </Example>
      </DashboardContainer>
    </>
  )
}
