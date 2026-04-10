import { Suspense } from "react";
import DashboardBreadcrumb from "../components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
import { pathClient } from "@/lib/path-client";
import { isAuthenticated } from "@/lib/auth-server";
import { Skeleton } from "@/components/ui/skeleton";
import TodoContent from "./components/todo-content";
import SignInPrompt from "../components/sign-in-prompt";

export default async function TodoPage() {
  const user = await isAuthenticated();

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

      <DashboardContainer className="max-w-2xl">
        {!user && (
          <SignInPrompt description="Add and manage your todos in one place" />
        )}
        {user && (
          <Suspense
            fallback={
              <div className="flex flex-col gap-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            }
          >
            <TodoContent />
          </Suspense>
        )}
      </DashboardContainer>
    </>
  );
}
