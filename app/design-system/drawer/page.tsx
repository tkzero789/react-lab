/* Drawer docs with a preview for each part */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Drawer",
  description: "A panel that slides up from the bottom and can be dragged.",
}

export default function DrawerPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Drawer" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Drawer"
            description="A panel that slides up from the bottom and can be dragged."
          />
          <Preview className="min-h-60">
            <Drawer>
              <DrawerTrigger
                render={<Button variant="outline">Open drawer</Button>}
              />
              <DrawerContent>
                <DrawerHeader className="gap-1">
                  <DrawerTitle>Filter deployments</DrawerTitle>
                  <DrawerDescription>
                    The list updates as you change a filter.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerBody>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="drawer-branch">Branch</FieldLabel>
                      <Input id="drawer-branch" placeholder="main" />
                    </Field>
                  </FieldGroup>
                </DrawerBody>
                <DrawerFooter>
                  <Button>Apply</Button>
                  <DrawerClose
                    render={<Button variant="outline">Cancel</Button>}
                  />
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Preview>
        </div>

        <Example
          title="Trigger"
          description={
            <>
              The drawer comes from Vaul, which is built on Radix. Its trigger
              takes <code>asChild</code>, not the <code>render</code> prop that
              the Base UI components use.
            </>
          }
        >
          <Drawer>
            <DrawerTrigger
              render={<Button variant="outline">Sort by</Button>}
            />
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Sort by</DrawerTitle>
              </DrawerHeader>
              <DrawerBody className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start">
                  Newest first
                </Button>
                <Button variant="ghost" className="justify-start">
                  Oldest first
                </Button>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Example>

        <Example
          title="When to Use"
          description={
            <>
              Use the drawer on a touch screen, because it can be dragged to
              close. Use a <code>Sheet</code> on a desktop, and a{" "}
              <code>Dialog</code> for a short question.
            </>
          }
        >
          <Drawer>
            <DrawerTrigger
              render={<Button variant="outline">Open actions</Button>}
            />
            <DrawerContent>
              <DrawerHeader className="gap-1">
                <DrawerTitle>Deployment 421</DrawerTitle>
                <DrawerDescription>Ready, 42 seconds.</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Promote to production</Button>
                <DrawerClose
                  render={<Button variant="outline">Close</Button>}
                />
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Example>

        <Example
          title="Title is Required"
          description={
            <>
              Always add <code>DrawerTitle</code>, because a screen reader reads
              it as the name of the panel. Add{" "}
              <code>{'className="sr-only"'}</code> to hide it on screen.
            </>
          }
        >
          <Drawer>
            <DrawerTrigger
              render={<Button variant="outline">Hidden title</Button>}
            />
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="sr-only">Quick actions</DrawerTitle>
              </DrawerHeader>
              <DrawerBody className="text-sm text-muted-foreground">
                The title is read out, but not shown.
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Example>
      </DashboardContainer>
    </>
  )
}
