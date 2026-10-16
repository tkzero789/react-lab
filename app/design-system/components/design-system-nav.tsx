/* Sidebar links to the design tokens and each documented component */
import { NavGroup } from "@/components/sidebar/nav-group"

import { uiComponents } from "../registry"

const foundations = [{ name: "Design Tokens", url: "/design-system/tokens" }]

const components = uiComponents
  .filter((component) => component.documented)
  .map((component) => ({
    name: component.name,
    url: `/design-system/${component.slug}`,
  }))

export default function DesignSystemNav() {
  return (
    <>
      <NavGroup label="Foundations" items={foundations} />
      <NavGroup label="Components" items={components} />
    </>
  )
}
