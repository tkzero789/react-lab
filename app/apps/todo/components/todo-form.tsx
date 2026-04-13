"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import React from "react";
import Dock from "../../components/dock";

export default function TodoForm() {
  const [todo, setTodo] = React.useState<string>("");

  const addTodo = useMutation(api.todos.add);

  async function handleAddTodo(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!todo.trim()) {
      return;
    }
    setTodo("");
    await addTodo({ name: todo });
  }

  return (
    <Dock>
      <form
        onSubmit={handleAddTodo}
        className="flex w-full items-center gap-2 bg-background p-4"
      >
        <Input
          placeholder="Enter todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <Button size="icon">
          <Plus />
        </Button>
      </form>
    </Dock>
  );
}
