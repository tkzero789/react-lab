"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
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
        <InputGroup>
          <InputGroupInput
            placeholder="Enter todo"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-sm">
              <Plus />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </Dock>
  );
}
