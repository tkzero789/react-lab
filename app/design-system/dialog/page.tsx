/* Dialog docs with a preview for each type and part */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Dialog",
  description: "A window over the page that takes the focus.",
}

export default function DialogPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Dialog" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Dialog"
            description="A window over the page that takes the focus."
          />
          <Preview className="min-h-60">
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>
                Edit profile
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Change your name and save when you are done.
                  </DialogDescription>
                </DialogHeader>
                <DialogBody>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="dialog-name">Name</FieldLabel>
                      <Input id="dialog-name" defaultValue="Thinh Tran" />
                    </Field>
                  </FieldGroup>
                </DialogBody>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>
                    Cancel
                  </DialogClose>
                  <Button>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Preview>
        </div>

        <Example
          title="Parts"
          description={
            <>
              Use <code>DialogHeader</code>, <code>DialogBody</code>, and{" "}
              <code>DialogFooter</code>. The body scrolls when the content is
              tall, so the header and the footer stay in place.
            </>
          }
        >
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              Long content
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Release notes</DialogTitle>
                <DialogDescription>Version 2.4.0</DialogDescription>
              </DialogHeader>
              <DialogBody className="flex max-h-64 flex-col gap-3 text-muted-foreground">
                {Array.from({ length: 8 }).map((_, index) => (
                  <p key={index}>
                    Change {index + 1}. The body scrolls on its own when the
                    content does not fit.
                  </p>
                ))}
              </DialogBody>
              <DialogFooter showCloseButton />
            </DialogContent>
          </Dialog>
        </Example>

        <Example
          title="Alert Type"
          description={
            <>
              Set <code>{'type="alert"'}</code> on <code>Dialog</code>. The
              description centers and the footer buttons share the width.
            </>
          }
        >
          <Dialog type="alert">
            <DialogTrigger render={<Button variant="outline" />}>
              Open alert
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Remove the domain?</DialogTitle>
                <DialogDescription>
                  Traffic to this domain stops at once.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Cancel
                </DialogClose>
                <Button variant="destructive">Remove</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Example>

        <Example
          title="No Close Button"
          description={
            <>
              Set <code>{"showCloseButton={false}"}</code> when the footer has
              the only way out.
            </>
          }
        >
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              Footer only
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>One more step</DialogTitle>
                <DialogDescription>
                  Confirm to finish the setup.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Later
                </DialogClose>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Example>

        <Example
          title="Width"
          description={
            <>
              Set the width with <code>className</code> on{" "}
              <code>DialogContent</code>. It is <code>max-w-sm</code> from the
              medium breakpoint.
            </>
          }
        >
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              Wide dialog
            </DialogTrigger>
            <DialogContent className="md:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Import records</DialogTitle>
                <DialogDescription>
                  A wide dialog suits a table or a side by side layout.
                </DialogDescription>
              </DialogHeader>
              <DialogBody className="text-muted-foreground">
                The content area is wider here.
              </DialogBody>
              <DialogFooter showCloseButton />
            </DialogContent>
          </Dialog>
        </Example>
      </DashboardContainer>
    </>
  )
}
