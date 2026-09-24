/* Direction docs with a preview of a right to left subtree */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Button } from "@/components/ui/button"
import { DirectionProvider } from "@/components/ui/direction"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Direction",
  description: "The text direction that the components read from.",
}

export default function DirectionPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Direction" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Direction"
            description="The text direction that the components read from."
          />
          <Preview className="min-h-60">
            <DirectionProvider direction="rtl">
              <div dir="rtl" className="flex flex-col items-end gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="outline" />}>
                    قائمة
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>حساب</DropdownMenuItem>
                      <DropdownMenuItem>إعدادات</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </DirectionProvider>
          </Preview>
        </div>

        <Example
          title="Provider"
          description={
            <>
              Wrap a subtree in <code>DirectionProvider</code> and set{" "}
              <code>{'direction="rtl"'}</code>. Base UI reads it to place
              popups, submenus, and arrow keys the right way round.
            </>
          }
        >
          <DirectionProvider direction="rtl">
            <div dir="rtl" className="flex w-full max-w-sm flex-col gap-2 text-sm">
              <p>النص يبدأ من اليمين.</p>
              <Button variant="outline" className="w-fit">
                زر
              </Button>
            </div>
          </DirectionProvider>
        </Example>

        <Example
          title="Set dir As Well"
          description={
            <>
              The provider tells the components, and the <code>dir</code>{" "}
              attribute tells the browser and CSS. Set both, and use logical
              classes such as <code>ps-2</code> instead of <code>pl-2</code>.
            </>
          }
        >
          <div className="flex w-full max-w-sm flex-col gap-3 text-sm">
            <div dir="ltr" className="rounded-lg border p-3">
              Left to right
            </div>
            <div dir="rtl" className="rounded-lg border p-3">
              من اليمين إلى اليسار
            </div>
          </div>
        </Example>

        <Example
          title="useDirection"
          description={
            <>
              Call <code>useDirection()</code> in a client component to read the
              current direction, for logic that depends on it.
            </>
          }
        >
          <p className="text-sm text-muted-foreground">
            It returns <code>ltr</code> or <code>rtl</code> from the closest
            provider.
          </p>
        </Example>
      </DashboardContainer>
    </>
  )
}
