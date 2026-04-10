"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function TodoList() {
  const todos = useQuery(api.todos.list);

  return (
    <ul className="flex flex-col gap-2">
      {todos?.map((todo) => (
        <li key={todo._id} className="rounded-xl border px-4 py-2 shadow">
          {todo.text}
        </li>
      ))}
    </ul>
  );
}
