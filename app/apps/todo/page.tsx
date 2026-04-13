"use client";

import DashboardBreadcrumb from "../components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
import { pathClient } from "@/lib/path-client";
import { Authenticated, Unauthenticated } from "convex/react";
import SignInPrompt from "../components/sign-in-prompt";
import TodoForm from "./components/todo-form";
import TodoList from "./components/todo-list";

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
      <DashboardContainer className="flex max-w-xl flex-1 flex-col p-0">
        <Unauthenticated>
          <SignInPrompt description="Add and manage your todos in one place" />
        </Unauthenticated>
        <Authenticated>
          <TodoList />
          <TodoForm />
        </Authenticated>
      </DashboardContainer>
    </>
  );
}
