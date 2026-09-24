/* Card docs with a preview for each part of the composition */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Card",
  description: "A surface that groups related content.",
}

export default function CardPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Card" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Card"
            description="A surface that groups related content."
          />
          <Preview className="min-h-60">
            <Card className="w-full max-w-sm">
              <CardHeader className="flex flex-col gap-1">
                <CardTitle>Monthly report</CardTitle>
                <CardDescription>
                  A summary of the last 30 days.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Visits grew by 12 percent. Sign ups stayed flat.
              </CardContent>
              <CardFooter className="gap-2">
                <Button size="sm">Open</Button>
                <Button size="sm" variant="outline">
                  Export
                </Button>
              </CardFooter>
            </Card>
          </Preview>
        </div>

        <Example
          title="Content Only"
          description={
            <>
              Use <code>CardContent</code> alone when the card needs no title.
            </>
          }
        >
          <Card className="w-full max-w-sm">
            <CardContent className="flex flex-col gap-1">
              <span className="text-2xl font-semibold tabular-nums">
                12,480
              </span>
              <span className="text-sm text-muted-foreground">
                Visits this week
              </span>
            </CardContent>
          </Card>
        </Example>

        <Example
          title="With Form"
          description={
            <>
              Put the form in <code>CardContent</code> and the actions in{" "}
              <code>CardFooter</code>.
            </>
          }
        >
          <Card className="w-full max-w-sm">
            <CardHeader className="flex flex-col gap-1">
              <CardTitle>Invite a teammate</CardTitle>
              <CardDescription>They get access to this project.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="card-invite-email">Email</FieldLabel>
                  <Input
                    id="card-invite-email"
                    type="email"
                    placeholder="name@example.com"
                  />
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter>
              <Button size="sm">Send invite</Button>
            </CardFooter>
          </Card>
        </Example>

        <Example
          title="Grid"
          description={
            <>
              The card fills its column, so a grid sets the width.
            </>
          }
        >
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-col gap-1">
                <CardTitle>Starter</CardTitle>
                <CardDescription>For one project.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Free for the first year.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-col gap-1">
                <CardTitle>Team</CardTitle>
                <CardDescription>For up to ten people.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Adds roles and audit logs.
              </CardContent>
            </Card>
          </div>
        </Example>
      </DashboardContainer>
    </>
  )
}
