"use client"

import DashboardBreadcrumb from "../components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { pathClient } from "@/lib/path-client"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import SignInPrompt from "../components/sign-in-prompt"
import Loader from "@/components/ui/loader"
import TodoApp from "./components/todo-app"
import { Suspense } from "react"

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
      <DashboardContainer className="flex max-w-none flex-1 flex-col p-0">
        <Unauthenticated>
          <SignInPrompt description="Add and manage your todos in one place" />
        </Unauthenticated>
        <AuthLoading>
          <Loader />
        </AuthLoading>
        <Authenticated>
          {/* useSearchParams in TodoApp needs a Suspense boundary for prerendering */}
          <Suspense fallback={<Loader />}>
            <TodoApp />
          </Suspense>
        </Authenticated>
      </DashboardContainer>
    </>
  )
}
