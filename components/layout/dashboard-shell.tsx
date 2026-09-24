/* Dashboard frame with the app sidebar on the left and the page on the right */
import React from "react"

import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}
