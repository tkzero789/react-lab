"use client"

/* Finance app page with the sign-in gate */

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import DashboardContainer from "@/components/layout/dashboard-container"
import Loader from "@/components/ui/loader"
import { pathClient } from "@/lib/path-client"
import DashboardBreadcrumb from "../components/dashboard-breadcrumb"
import SignInPrompt from "../components/sign-in-prompt"
import FinanceDashboard from "./components/finance-dashboard"

export default function FinancePage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Apps", href: pathClient("/apps") },
          { title: "Finance" },
        ]}
      />
      <DashboardContainer>
        <Unauthenticated>
          <SignInPrompt description="Track your income, spending, and budgets" />
        </Unauthenticated>
        <AuthLoading>
          <Loader />
        </AuthLoading>
        <Authenticated>
          <FinanceDashboard />
        </Authenticated>
      </DashboardContainer>
    </>
  )
}
