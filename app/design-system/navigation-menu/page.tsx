/* Navigation Menu docs with a preview for each layout */
import type { Metadata } from "next"
import Link from "next/link"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"

export const metadata: Metadata = {
  title: "Navigation Menu",
  description: "A site navigation bar with panels of links.",
}

export default function NavigationMenuPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Navigation Menu" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Navigation Menu"
            description="A site navigation bar with panels of links."
          />
          <Preview className="min-h-60">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent className="flex w-64 flex-col gap-1">
                    <NavigationMenuLink render={<Link href="/apps" />}>
                      Apps
                    </NavigationMenuLink>
                    <NavigationMenuLink render={<Link href="/playground" />}>
                      Playground
                    </NavigationMenuLink>
                    <NavigationMenuLink render={<Link href="/replicas" />}>
                      Replicas
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    render={<Link href="/design-system" />}
                  >
                    Design System
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </Preview>
        </div>

        <Example
          title="Plain Link"
          description={
            <>
              For an item with no panel, put a <code>NavigationMenuLink</code>{" "}
              in the item and give it{" "}
              <code>navigationMenuTriggerStyle()</code> so it matches the
              triggers.
            </>
          }
        >
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  render={<Link href="/" />}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  render={<Link href="/apps" />}
                >
                  Apps
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Example>

        <Example
          title="Panel Layout"
          description={
            <>
              The content is a plain box, so use a grid inside it for a wide
              panel of links.
            </>
          }
        >
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
                <NavigationMenuContent className="grid w-96 grid-cols-2 gap-1">
                  {[
                    "Getting started",
                    "Components",
                    "Design tokens",
                    "Patterns",
                  ].map((label) => (
                    <NavigationMenuLink
                      key={label}
                      render={<Link href="/design-system" />}
                    >
                      {label}
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Example>

        <Example
          title="Active Link"
          description={
            <>
              Set <code>data-active</code> on the link of the current page, so
              it keeps a muted background.
            </>
          }
        >
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  data-active
                  className={navigationMenuTriggerStyle()}
                  render={<Link href="/design-system" />}
                >
                  Current page
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  render={<Link href="/apps" />}
                >
                  Another page
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Example>
      </DashboardContainer>
    </>
  )
}
