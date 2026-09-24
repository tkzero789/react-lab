/* Toast docs with a preview for each type and option */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"
import {
  ToastAction,
  ToastDescription,
  ToastPromise,
  ToastTypes,
} from "./toast-demo"

export const metadata: Metadata = {
  title: "Toast",
  description: "A short message that appears over the page after an action.",
}

export default function ToastPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Toast" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Toast"
            description="A short message that appears over the page after an action."
          />
          <Preview className="min-h-60">
            <ToastTypes />
          </Preview>
        </div>

        <Example
          title="Setup"
          description={
            <>
              <code>Toaster</code> wraps the app in{" "}
              <code>app/layout.tsx</code> already. Call{" "}
              <code>toast.add()</code> from a client component to raise one.
            </>
          }
        >
          <ToastTypes />
        </Example>

        <Example
          title="Description"
          description={
            <>
              Pass <code>description</code> for a second line. Keep the title
              short, because it is what the user reads first.
            </>
          }
        >
          <ToastDescription />
        </Example>

        <Example
          title="Action"
          description={
            <>
              Pass <code>actionProps</code> with <code>children</code> and an{" "}
              <code>onClick</code>. Use it for a step the user can undo.
            </>
          }
        >
          <ToastAction />
        </Example>

        <Example
          title="Update a Toast"
          description={
            <>
              <code>toast.add()</code> returns an id. Pass it to{" "}
              <code>toast.update()</code> to turn a loading toast into the
              result.
            </>
          }
        >
          <ToastPromise />
        </Example>
      </DashboardContainer>
    </>
  )
}
