/* Button docs with a preview for each variant and size */
import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Mail,
  Plus,
  Trash2,
} from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Button",
  description: "Displays a button or a component that looks like a button.",
}

export default function ButtonPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Button" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Button"
            description="Displays a button or a component that looks like a button."
          />
          <Preview className="min-h-60">
            <Button>Button</Button>
          </Preview>
        </div>

        <Example
          title="Size"
          description={
            <>
              Set <code>{'size="xs"'}</code> or <code>{'size="sm"'}</code>. Omit{" "}
              <code>size</code> for the default.
            </>
          }
        >
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
        </Example>

        <Example
          title="Default"
          description={
            <>
              Omit <code>variant</code>.
            </>
          }
        >
          <Button>Default</Button>
        </Example>

        <Example
          title="Muted"
          description={
            <>
              Set <code>{'variant="muted"'}</code>.
            </>
          }
        >
          <Button variant="muted">Muted</Button>
        </Example>

        <Example
          title="Outline"
          description={
            <>
              Set <code>{'variant="outline"'}</code>.
            </>
          }
        >
          <Button variant="outline">Outline</Button>
        </Example>

        <Example
          title="Ghost"
          description={
            <>
              Set <code>{'variant="ghost"'}</code>.
            </>
          }
        >
          <Button variant="ghost">Ghost</Button>
        </Example>

        <Example
          title="Destructive"
          description={
            <>
              Set <code>{'variant="destructive"'}</code>.
            </>
          }
        >
          <Button variant="destructive">Destructive</Button>
        </Example>

        <Example
          title="Ghost Destructive"
          description={
            <>
              Set <code>{'variant="ghost-destructive"'}</code>.
            </>
          }
        >
          <Button variant="ghost-destructive">
            <Trash2 data-icon="inline-start" />
            Delete
          </Button>
        </Example>

        <Example
          title="Link"
          description={
            <>
              Set <code>{'variant="link"'}</code>.
            </>
          }
        >
          <Button variant="link">Link</Button>
        </Example>

        <Example
          title="Input"
          description={
            <>
              Set <code>{'variant="input"'}</code>. Set the width with{" "}
              <code>className</code>.
            </>
          }
        >
          <Button variant="input" className="w-64">
            <CalendarDays />
            Pick a date
          </Button>
        </Example>

        <Example
          title="Icon"
          description={
            <>
              Set <code>{'size="icon-xs"'}</code>,{" "}
              <code>{'size="icon-sm"'}</code>, or <code>{'size="icon"'}</code>.
              Add an <code>aria-label</code> because the button has no text.
            </>
          }
        >
          <Button size="icon-xs" variant="outline" aria-label="Add">
            <Plus />
          </Button>
          <Button size="icon-sm" variant="outline" aria-label="Add">
            <Plus />
          </Button>
          <Button size="icon" variant="outline" aria-label="Add">
            <Plus />
          </Button>
        </Example>

        <Example
          title="Pill"
          description={
            <>
              Set <code>{'shape="pill"'}</code>. An icon button becomes a
              circle.
            </>
          }
        >
          <Button shape="pill">Pill</Button>
          <Button shape="pill" variant="outline">
            <Mail data-icon="inline-start" />
            Login with Email
          </Button>
          <Button
            shape="pill"
            size="icon-sm"
            variant="outline"
            aria-label="Add"
          >
            <Plus />
          </Button>
        </Example>

        <Example
          title="With Icon"
          description={
            <>
              Set <code>{'data-icon="inline-start"'}</code> or{" "}
              <code>{'data-icon="inline-end"'}</code> on the icon.
            </>
          }
        >
          <Button variant="outline">
            <Mail data-icon="inline-start" />
            Login with Email
          </Button>
          <Button>
            Continue
            <ChevronRight data-icon="inline-end" />
          </Button>
        </Example>

        <Example
          title="Spinner"
          description={
            <>
              Add <code>{'<Spinner data-icon="inline-start" />'}</code> and set{" "}
              <code>disabled</code> while the action runs.
            </>
          }
        >
          <Button disabled>
            <Spinner data-icon="inline-start" />
            Saving
          </Button>
          <Button variant="outline" disabled>
            <Spinner data-icon="inline-start" />
            Loading
          </Button>
        </Example>

        <Example
          title="As Link"
          description={
            <>
              Set <code>{'render={<Link href="/" />}'}</code> and{" "}
              <code>{"nativeButton={false}"}</code>.
            </>
          }
        >
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/design-system" />}
          >
            <ArrowLeft data-icon="inline-start" />
            All components
          </Button>
        </Example>
      </DashboardContainer>
    </>
  )
}
