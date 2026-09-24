/* Design system index that lists every component in components/ui */
import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { Badge } from "@/components/ui/badge"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"

import DocsHeader from "./components/docs-header"
import { uiComponents } from "./registry"

export const metadata: Metadata = {
  title: "Design System",
  description: "Every UI component in the project and its variants.",
}

export default function DesignSystemPage() {
  return (
    <>
      <DashboardBreadcrumb breadcrumbs={[{ title: "Design System" }]} />
      <DashboardContainer className="flex max-w-4xl flex-col gap-8 py-8">
        <DocsHeader
          title="Design System"
          description="Every UI component in the project and its variants."
        />
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Foundations</h2>
          <ItemGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Item
              pressable
              role="listitem"
              variant="outline"
              render={<Link href="/design-system/tokens" />}
            >
              <ItemContent>
                <ItemTitle>Design Tokens</ItemTitle>
              </ItemContent>
              <ItemActions>
                <ChevronRight className="size-4 text-muted-foreground" />
              </ItemActions>
            </Item>
          </ItemGroup>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Components</h2>
          <ItemGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {uiComponents.map((component) =>
              component.documented ? (
                <Item
                  pressable
                  key={component.slug}
                  role="listitem"
                  variant="outline"
                  render={<Link href={`/design-system/${component.slug}`} />}
                >
                  <ItemContent>
                    <ItemTitle>{component.name}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </ItemActions>
                </Item>
              ) : (
                <Item key={component.slug} role="listitem" variant="muted">
                  <ItemContent>
                    <ItemTitle className="text-muted-foreground">
                      {component.name}
                    </ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <Badge variant="outline">Soon</Badge>
                  </ItemActions>
                </Item>
              )
            )}
          </ItemGroup>
        </section>
      </DashboardContainer>
    </>
  )
}
