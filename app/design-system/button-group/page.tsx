/* Button Group docs with a preview for each orientation and part */
import type { Metadata } from "next"
import { ChevronDown, Copy, Redo2, Undo2 } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Button Group",
  description: "Buttons joined into one control with shared edges.",
}

export default function ButtonGroupPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Button Group" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Button Group"
            description="Buttons joined into one control with shared edges."
          />
          <Preview className="min-h-60">
            <ButtonGroup>
              <Button variant="outline">
                <Undo2 data-icon="inline-start" />
                Undo
              </Button>
              <Button variant="outline">
                <Redo2 data-icon="inline-start" />
                Redo
              </Button>
            </ButtonGroup>
          </Preview>
        </div>

        <Example
          title="Orientation"
          description={
            <>
              Set <code>{'orientation="vertical"'}</code> to stack the buttons.
              The group rounds only the outer corners.
            </>
          }
        >
          <ButtonGroup>
            <Button variant="outline">Day</Button>
            <Button variant="outline">Week</Button>
            <Button variant="outline">Month</Button>
          </ButtonGroup>
          <ButtonGroup orientation="vertical">
            <Button variant="outline">Top</Button>
            <Button variant="outline">Middle</Button>
            <Button variant="outline">Bottom</Button>
          </ButtonGroup>
        </Example>

        <Example
          title="Split Button"
          description={
            <>
              Put a menu trigger at the end for the secondary actions of a main
              button.
            </>
          }
        >
          <ButtonGroup>
            <Button>Deploy</Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button size="icon" aria-label="More deploy options" />}
              >
                <ChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem>Deploy to preview</DropdownMenuItem>
                  <DropdownMenuItem>Deploy from a branch</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </Example>

        <Example
          title="With Text"
          description={
            <>
              Use <code>ButtonGroupText</code> for a fixed label, such as a
              prefix or a unit.
            </>
          }
        >
          <ButtonGroup>
            <ButtonGroupText>https://</ButtonGroupText>
            <Input placeholder="example.com" className="w-48" />
            <Button variant="outline">
              <Copy data-icon="inline-start" />
              Copy
            </Button>
          </ButtonGroup>
        </Example>

        <Example
          title="Separator"
          description={
            <>
              Add <code>ButtonGroupSeparator</code> between buttons that share
              one fill, so the edge stays visible.
            </>
          }
        >
          <ButtonGroup>
            <Button variant="muted">Approve</Button>
            <ButtonGroupSeparator />
            <Button variant="muted">Reject</Button>
          </ButtonGroup>
        </Example>

        <Example
          title="Nested Groups"
          description={
            <>
              Put a group inside a group. The outer group adds a gap, so the two
              sets read as separate controls.
            </>
          }
        >
          <ButtonGroup>
            <ButtonGroup>
              <Button variant="outline">Bold</Button>
              <Button variant="outline">Italic</Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline">Left</Button>
              <Button variant="outline">Center</Button>
            </ButtonGroup>
          </ButtonGroup>
        </Example>
      </DashboardContainer>
    </>
  )
}
