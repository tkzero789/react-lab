/* Dashboard frame with the app sidebar on the left and the page on the right */
import React from "react"

import { AppSidebar } from "@/components/sidebar/app-sidebar"
import type { ProjectId } from "@/components/sidebar/projects"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

type Props = {
  project: ProjectId
  nav: React.ReactNode
  children: React.ReactNode
}

export default function DashboardShell({ project, nav, children }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar project={project} nav={nav} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}
