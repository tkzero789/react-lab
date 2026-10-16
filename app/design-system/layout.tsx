import DashboardShell from "@/components/layout/dashboard-shell"
import React from "react"
import DesignSystemNav from "./components/design-system-nav"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell project="designSystem" nav={<DesignSystemNav />}>
      {children}
    </DashboardShell>
  )
}
