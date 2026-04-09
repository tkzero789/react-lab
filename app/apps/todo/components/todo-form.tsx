"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import React, { ChangeEvent } from "react";

export default function TodoForm() {
  const [todo, setTodo] = React.useState<string>("");

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    setTodo(e.target.value);
  }

  const addTodo = useMutation(api.todos.add);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!todo.trim()) {
      return;
    }
    await addTodo({ name: todo });
    setTodo("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add todo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            placeholder="Enter todo"
            value={todo}
            onChange={handleOnChange}
          />
          <Button type="submit">Add</Button>
          <Button>Check</Button>
        </form>
      </CardContent>
    </Card>
  );
}
