/* Alert Dialog docs with a preview for each size and layout */
import type { Metadata } from "next"
import { TriangleAlert } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Alert Dialog",
  description: "A modal that asks the user to confirm an action.",
}

export default function AlertDialogPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Alert Dialog" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Alert Dialog"
            description="A modal that asks the user to confirm an action."
          />
          <Preview className="min-h-60">
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline" />}>
                Delete project
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes the project and all of its deployments. You
                    cannot undo this.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Preview>
        </div>

        <Example
          title="Default Size"
          description={
            <>
              Set <code>{'size="default"'}</code> on{" "}
              <code>AlertDialogContent</code>. The text aligns to the start on a
              wide screen.
            </>
          }
        >
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>
              Open default
            </AlertDialogTrigger>
            <AlertDialogContent size="default">
              <AlertDialogHeader>
                <AlertDialogTitle>Leave the workspace?</AlertDialogTitle>
                <AlertDialogDescription>
                  You lose access to every project in this workspace. An owner
                  has to invite you again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Stay</AlertDialogCancel>
                <AlertDialogAction>Leave</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Example>

        <Example
          title="With Media"
          description={
            <>
              Put an icon in <code>AlertDialogMedia</code> as the first child of{" "}
              <code>AlertDialogHeader</code>.
            </>
          }
        >
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>
              Open with icon
            </AlertDialogTrigger>
            <AlertDialogContent size="default">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <TriangleAlert />
                </AlertDialogMedia>
                <AlertDialogTitle>Your plan is over quota</AlertDialogTitle>
                <AlertDialogDescription>
                  New builds stop until the next billing cycle. Upgrade to
                  continue now.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Not now</AlertDialogCancel>
                <AlertDialogAction>Upgrade</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Example>

        <Example
          title="Cancel Variant"
          description={
            <>
              Set <code>variant</code> on <code>AlertDialogCancel</code>. It is{" "}
              <code>outline</code> by default.
            </>
          }
        >
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>
              Ghost cancel
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Discard the draft?</AlertDialogTitle>
                <AlertDialogDescription>
                  The draft is not saved yet.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="ghost">Keep</AlertDialogCancel>
                <AlertDialogAction variant="destructive">
                  Discard
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Example>
      </DashboardContainer>
    </>
  )
}
