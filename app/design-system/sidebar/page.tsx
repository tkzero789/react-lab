/* Sidebar docs with a preview of the app shell parts */
import type { Metadata } from "next"
import { Calendar, Home, Inbox, Search } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Sidebar",
  description: "The navigation panel of the app shell.",
}

const links = [
  { title: "Home", icon: Home, badge: undefined },
  { title: "Inbox", icon: Inbox, badge: "4" },
  { title: "Calendar", icon: Calendar, badge: undefined },
  { title: "Search", icon: Search, badge: undefined },
]

export default function SidebarPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Sidebar" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Sidebar"
            description="The navigation panel of the app shell."
          />
          <Preview className="min-h-60">
            <SidebarProvider className="min-h-72 w-full max-w-md overflow-hidden rounded-lg border">
              <Sidebar collapsible="none" className="w-48 border-r">
                <SidebarHeader className="px-3 py-2 text-sm font-medium">
                  Acme
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {links.map((link) => (
                          <SidebarMenuItem key={link.title}>
                            <SidebarMenuButton isActive={link.title === "Home"}>
                              <link.icon />
                              {link.title}
                            </SidebarMenuButton>
                            {link.badge ? (
                              <SidebarMenuBadge>{link.badge}</SidebarMenuBadge>
                            ) : null}
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
                <SidebarFooter className="px-3 py-2 text-xs text-muted-foreground">
                  v2.4.0
                </SidebarFooter>
              </Sidebar>
              <div className="flex-1 p-4 text-sm text-muted-foreground">
                The page content sits here.
              </div>
            </SidebarProvider>
          </Preview>
        </div>

        <Example
          title="Structure"
          description={
            <>
              Wrap the app in <code>SidebarProvider</code>. Inside{" "}
              <code>Sidebar</code>, use <code>SidebarHeader</code>,{" "}
              <code>SidebarContent</code> with one{" "}
              <code>SidebarGroup</code> per section, and{" "}
              <code>SidebarFooter</code>.
            </>
          }
        >
          <SidebarProvider className="min-h-56 w-full max-w-md overflow-hidden rounded-lg border">
            <Sidebar collapsible="none" className="w-48 border-r">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Projects</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton>design-system</SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>billing-api</SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
            <div className="flex-1 p-4 text-sm text-muted-foreground">
              Content
            </div>
          </SidebarProvider>
        </Example>

        <Example
          title="Variant and Side"
          description={
            <>
              Set <code>variant</code> to <code>sidebar</code>,{" "}
              <code>floating</code>, or <code>inset</code>, and{" "}
              <code>side</code> to <code>left</code> or <code>right</code>. Set{" "}
              <code>collapsible</code> to <code>offcanvas</code>,{" "}
              <code>icon</code>, or <code>none</code>.
            </>
          }
        >
          <SidebarProvider className="min-h-56 w-full max-w-md overflow-hidden rounded-lg border">
            <div className="flex-1 p-4 text-sm text-muted-foreground">
              A sidebar on the right.
            </div>
            <Sidebar collapsible="none" side="right" className="w-44 border-l">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton>Activity</SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </SidebarProvider>
        </Example>

        <Example
          title="Trigger"
          description={
            <>
              Put a <code>SidebarTrigger</code> in the page header to open and
              close the panel. It reads the state from the provider, and{" "}
              <code>useSidebar()</code> gives the same state to your own code.
            </>
          }
        >
          <SidebarProvider className="min-h-24 w-full max-w-md items-center justify-center rounded-lg border">
            <SidebarTrigger />
          </SidebarProvider>
        </Example>

        <Example
          title="In This App"
          description={
            <>
              The dashboard shell already mounts the sidebar. See{" "}
              <code>components/sidebar</code> for the real navigation that this
              page sits in.
            </>
          }
        >
          <p className="text-sm text-muted-foreground">
            Every page under <code>/apps</code> and{" "}
            <code>/design-system</code> renders inside that shell.
          </p>
        </Example>
      </DashboardContainer>
    </>
  )
}
