/* Alert docs with a preview for each variant */
import type { Metadata } from "next"
import { CircleAlert, Info, Rocket } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Alert",
  description: "A callout for a message that needs attention.",
}

export default function AlertPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Alert" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Alert"
            description="A callout for a message that needs attention."
          />
          <Preview className="min-h-60">
            <Alert className="max-w-md">
              <Rocket />
              <AlertTitle>Deployment started</AlertTitle>
              <AlertDescription>
                The build runs now. You get an email when it is live.
              </AlertDescription>
            </Alert>
          </Preview>
        </div>

        <Example
          title="Default"
          description={
            <>
              Omit <code>variant</code>. Put the icon before{" "}
              <code>AlertTitle</code>.
            </>
          }
        >
          <Alert className="max-w-md">
            <Info />
            <AlertTitle>Scheduled maintenance</AlertTitle>
            <AlertDescription>
              The service is read only on Sunday from 02:00 to 04:00 UTC.
            </AlertDescription>
          </Alert>
        </Example>

        <Example
          title="Destructive"
          description={
            <>
              Set <code>{'variant="destructive"'}</code> for an error the user
              must fix.
            </>
          }
        >
          <Alert variant="destructive" className="max-w-md">
            <CircleAlert />
            <AlertTitle>Payment failed</AlertTitle>
            <AlertDescription>
              The card was declined. Use another card to keep the subscription.
            </AlertDescription>
          </Alert>
        </Example>

        <Example
          title="Title Only"
          description={
            <>
              Leave out <code>AlertDescription</code> for a short message.
            </>
          }
        >
          <Alert className="max-w-md">
            <Info />
            <AlertTitle>The changes are saved.</AlertTitle>
          </Alert>
        </Example>

        <Example
          title="No Icon"
          description={
            <>
              Leave out the icon. The grid closes the icon column on its own.
            </>
          }
        >
          <Alert className="max-w-md">
            <AlertTitle>Draft saved</AlertTitle>
            <AlertDescription>
              The draft stays private until you publish it.
            </AlertDescription>
          </Alert>
        </Example>
      </DashboardContainer>
    </>
  )
}
