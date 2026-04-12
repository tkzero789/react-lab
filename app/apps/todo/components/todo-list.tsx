"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Trash2 } from "lucide-react";
import React from "react";

export default function TodoList() {
  const todos = useQuery(api.todos.list);

  const removeTodo = useMutation(api.todos.remove);

  async function handleRemoveTodo(todoId: Id<"todos">) {
    await removeTodo({ id: todoId });
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos?.map((todo) => (
        <li
          key={todo._id}
          className="flex items-center justify-between gap-4 rounded-xl border px-4 py-2 shadow"
        >
          {todo.text}
          <Button
            variant="ghost-destructive"
            size="icon-sm"
            onClick={() => handleRemoveTodo(todo._id)}
          >
            <Trash2 />
          </Button>
        </li>
      ))}
    </ul>
  );
}
