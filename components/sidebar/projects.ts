/* Lab projects shown in the sidebar project switcher */
import {
  AppWindow,
  FlaskConical,
  Laptop,
  Palette,
  PieChart,
  RollerCoaster,
} from "lucide-react"

import type { NavItem } from "@/components/sidebar/nav-group"

export const projects = {
  lab: {
    name: "Lab",
    url:
      process.env.NODE_ENV === "production" ? "https://lab.thinhtran.dev" : "/",
    icon: FlaskConical,
  },
  apps: { name: "Apps", url: "/apps", icon: AppWindow },
  replicas: { name: "Web Replicas", url: "/replicas", icon: Laptop },
  playground: { name: "Playground", url: "/playground", icon: RollerCoaster },
  designSystem: { name: "Design System", url: "/design-system", icon: Palette },
  threejs: { name: "ThreeJS", url: "/threejs", icon: PieChart },
} satisfies Record<string, Required<NavItem>>

export type ProjectId = keyof typeof projects
