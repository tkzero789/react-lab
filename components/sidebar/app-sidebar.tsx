/* Dashboard sidebar with the project switcher, the section nav, and the user menu */
"use client"

import * as React from "react"

import { ProjectSwitcher } from "@/components/sidebar/project-switcher"
import type { ProjectId } from "@/components/sidebar/projects"
import { SidebarUser } from "@/components/sidebar/sidebar-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

type Props = React.ComponentProps<typeof Sidebar> & {
  project: ProjectId
  nav: React.ReactNode
}

export function AppSidebar({ project, nav, ...props }: Props) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <ProjectSwitcher project={project} />
      </SidebarHeader>
      <SidebarContent className="scroll-fade scrollbar-thin">
        {nav}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  )
}
