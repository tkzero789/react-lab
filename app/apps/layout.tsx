import DashboardShell from "@/components/layout/dashboard-shell"
import React from "react"
import AppsNav from "./components/apps-nav"
import QueryProvider from "./components/query-provider"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell project="apps" nav={<AppsNav />}>
      <QueryProvider>{children}</QueryProvider>
    </DashboardShell>
  )
}
