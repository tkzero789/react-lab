"use client";

import TodoForm from "./todo-form";
import TodoList from "./todo-list";
import SignInPrompt from "../../components/sign-in-prompt";
import { Authenticated, Unauthenticated } from "convex/react";

export default function TodoContent() {
  return (
    <>
      <Unauthenticated>
        <SignInPrompt description="Add and manage your todos in one place" />
      </Unauthenticated>

      <Authenticated>
        <div className="flex flex-col gap-4">
          <TodoForm />
          <TodoList />
        </div>
      </Authenticated>
    </>
  );
}
