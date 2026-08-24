"use client"

import DashboardBreadcrumb from "../components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { pathClient } from "@/lib/path-client"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import SignInPrompt from "../components/sign-in-prompt"
import Loader from "@/components/ui/loader"
import TodoApp from "./components/todo-app"

export default function TodoPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          {
            title: "Apps",
            href: pathClient("/apps"),
          },
          {
            title: "Todo",
          },
        ]}
      />
      <DashboardContainer className="p-0">
        <Unauthenticated>
          <SignInPrompt description="Add and manage your todos in one place" />
        </Unauthenticated>
        <AuthLoading>
          <Loader />
        </AuthLoading>
        <Authenticated>
          <TodoApp />
        </Authenticated>
      </DashboardContainer>
    </>
  )
}
