"use client";

import { api } from "@/convex/_generated/api";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import { Preloaded } from "convex/react";

type Props = {
  preloadedTodos: Preloaded<typeof api.todos.list>;
};

export default function TodoList({ preloadedTodos }: Props) {
  const todos = usePreloadedAuthQuery(preloadedTodos);
  return (
    <ul className="flex flex-col gap-2">
      {todos?.map((todo) => (
        <li key={todo._id} className="rounded-xl border px-4 py-2 shadow">
          {todo.name}
        </li>
      ))}
    </ul>
  );
}
