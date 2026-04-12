"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import React from "react";

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
    <Card>
      <CardHeader>
        <CardTitle>Add todo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTodo} className="flex items-center gap-2">
          <Input
            placeholder="Enter todo"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <Button type="submit">Add</Button>
        </form>
      </CardContent>
    </Card>
  );
}
