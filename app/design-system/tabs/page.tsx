/* Tabs docs with a preview for each variant and orientation */
import type { Metadata } from "next"
import { BarChart3, Settings, User } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Tabs",
  description: "One panel at a time, picked from a row of triggers.",
}

export default function TabsPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Tabs" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Tabs"
            description="One panel at a time, picked from a row of triggers."
          />
          <Preview className="min-h-60">
            <Tabs defaultValue="overview" className="w-full max-w-md">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="text-muted-foreground">
                Traffic and usage for the last 30 days.
              </TabsContent>
              <TabsContent value="activity" className="text-muted-foreground">
                Every deploy and who started it.
              </TabsContent>
              <TabsContent value="settings" className="text-muted-foreground">
                Names, domains, and environment variables.
              </TabsContent>
            </Tabs>
          </Preview>
        </div>

        <Example
          title="Line"
          description={
            <>
              Set <code>{'variant="line"'}</code> on <code>TabsList</code> for
              an underline instead of a filled bar.
            </>
          }
        >
          <Tabs defaultValue="code" className="w-full max-w-md">
            <TabsList variant="line">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="text-muted-foreground">
              The source of the example.
            </TabsContent>
            <TabsContent value="preview" className="text-muted-foreground">
              The rendered result.
            </TabsContent>
          </Tabs>
        </Example>

        <Example
          title="Vertical"
          description={
            <>
              Set <code>{'orientation="vertical"'}</code> on <code>Tabs</code>.
              The list stacks and the panel sits beside it.
            </>
          }
        >
          <Tabs
            orientation="vertical"
            defaultValue="profile"
            className="w-full max-w-md"
          >
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="text-muted-foreground">
              Your name and picture.
            </TabsContent>
            <TabsContent value="billing" className="text-muted-foreground">
              Cards and invoices.
            </TabsContent>
            <TabsContent value="team" className="text-muted-foreground">
              People with access.
            </TabsContent>
          </Tabs>
        </Example>

        <Example
          title="With Icons"
          description={
            <>
              Put an icon before the label. The trigger sizes it for you.
            </>
          }
        >
          <Tabs defaultValue="stats" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="stats">
                <BarChart3 />
                Stats
              </TabsTrigger>
              <TabsTrigger value="people">
                <User />
                People
              </TabsTrigger>
              <TabsTrigger value="config">
                <Settings />
                Config
              </TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="text-muted-foreground">
              Numbers for this project.
            </TabsContent>
            <TabsContent value="people" className="text-muted-foreground">
              Members and roles.
            </TabsContent>
            <TabsContent value="config" className="text-muted-foreground">
              Build and runtime settings.
            </TabsContent>
          </Tabs>
        </Example>

        <Example
          title="Disabled Tab"
          description={
            <>
              Set <code>disabled</code> on a <code>TabsTrigger</code> the user
              cannot open yet.
            </>
          }
        >
          <Tabs defaultValue="draft" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="published" disabled>
                Published
              </TabsTrigger>
            </TabsList>
            <TabsContent value="draft" className="text-muted-foreground">
              Publish the page to open the second tab.
            </TabsContent>
          </Tabs>
        </Example>
      </DashboardContainer>
    </>
  )
}
