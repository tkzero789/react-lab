import DashboardShell from "@/components/layout/dashboard-shell"
import React from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
