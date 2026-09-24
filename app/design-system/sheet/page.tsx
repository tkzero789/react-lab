/* Sheet docs with a preview for each side and variant */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Sheet",
  description: "A panel that slides in from an edge of the screen.",
}

export default function SheetPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Sheet" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Sheet"
            description="A panel that slides in from an edge of the screen."
          />
          <Preview className="min-h-60">
            <Sheet>
              <SheetTrigger render={<Button variant="outline" />}>
                Open settings
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className="gap-1">
                  <SheetTitle>Project settings</SheetTitle>
                  <SheetDescription>
                    Changes save when you submit the form.
                  </SheetDescription>
                </SheetHeader>
                <SheetBody>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="sheet-name">Name</FieldLabel>
                      <Input id="sheet-name" defaultValue="my-app" />
                    </Field>
                  </FieldGroup>
                </SheetBody>
                <SheetFooter>
                  <SheetClose render={<Button variant="outline" />}>
                    Cancel
                  </SheetClose>
                  <Button>Save</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </Preview>
        </div>

        <Example
          title="Side"
          description={
            <>
              Set <code>side</code> to <code>top</code>, <code>right</code>,{" "}
              <code>bottom</code>, or <code>left</code>. The default is{" "}
              <code>right</code>.
            </>
          }
        >
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger render={<Button variant="outline" size="sm" />}>
                {side}
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>From the {side}</SheetTitle>
                </SheetHeader>
                <SheetBody className="text-muted-foreground">
                  The panel slides in from the {side}.
                </SheetBody>
              </SheetContent>
            </Sheet>
          ))}
        </Example>

        <Example
          title="Float"
          description={
            <>
              Set <code>{'variant="float"'}</code> so the panel sits away from
              the edge with rounded corners.
            </>
          }
        >
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Float
            </SheetTrigger>
            <SheetContent variant="float">
              <SheetHeader>
                <SheetTitle>Floating panel</SheetTitle>
              </SheetHeader>
              <SheetBody className="text-muted-foreground">
                The panel keeps a margin on every side.
              </SheetBody>
            </SheetContent>
          </Sheet>
        </Example>

        <Example
          title="Compact"
          description={
            <>
              Set <code>{'variant="compact"'}</code> so the panel is only as
              tall as its content.
            </>
          }
        >
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Compact
            </SheetTrigger>
            <SheetContent variant="compact" side="bottom">
              <SheetHeader className="gap-1">
                <SheetTitle>Share this page</SheetTitle>
                <SheetDescription>Anyone with the link can read it.</SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <SheetClose render={<Button variant="outline" />}>
                  Close
                </SheetClose>
                <Button>Copy link</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Example>
      </DashboardContainer>
    </>
  )
}
