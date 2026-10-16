import DashboardShell from "@/components/layout/dashboard-shell"
import React from "react"
import DesignSystemNav from "./components/design-system-nav"
import DocsTopNav from "./components/docs-top-nav"
import OnThisPage from "./components/on-this-page"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell project="designSystem" nav={<DesignSystemNav />}>
      {/* Each page returns its breadcrumb header and its content as siblings. The header spans both columns. The top nav takes row 2, so the content moves to row 3. */}
      <div className="grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:[&>header]:col-span-full">
        {children}
        <DocsTopNav />
        <OnThisPage />
      </div>
    </DashboardShell>
  )
}
