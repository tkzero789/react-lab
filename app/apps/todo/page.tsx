import DashboardBreadcrumb from "../components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
import { pathClient } from "@/lib/path-client";
import TodoForm from "./components/todo-form";
import { isAuthenticated, preloadAuthQuery } from "@/lib/auth-server";
import TodoList from "./components/todo-list";
import SignInPrompt from "../components/sign-in-prompt";
import { Suspense } from "react";
import { api } from "@/convex/_generated/api";

export default async function TodoPage() {
  const user = await isAuthenticated();
  const preloadTodos = user ? await preloadAuthQuery(api.todos.list) : null;

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
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex flex-col gap-4">
            {!user && (
              <SignInPrompt description="Add and manage your todos in one place" />
            )}
            {user && <TodoForm />}
            {user && preloadTodos && <TodoList preloadedTodos={preloadTodos} />}
          </div>
        </Suspense>
      </DashboardContainer>
    </>
  );
}
