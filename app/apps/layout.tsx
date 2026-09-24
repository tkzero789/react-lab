import DashboardShell from "@/components/layout/dashboard-shell"
import React from "react"
import QueryProvider from "./components/query-provider"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      <QueryProvider>{children}</QueryProvider>
    </DashboardShell>
  )
}
