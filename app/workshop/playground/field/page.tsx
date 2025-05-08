"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";

export default function FieldPage() {
  const [task, setTask] = React.useState<string>("");
  const [taskList, setTaskList] = React.useState<string[]>([]);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTask(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (task.trim() === "") {
      toast.error("Empty input");
      return;
    } else {
      setTaskList((prev) => [...prev, task]);
      toast.success("Task added");
      setTask("");
    }
  }

  function handleRemove(indexToRemove: number) {
    setTaskList(taskList.filter((_, index) => index !== indexToRemove));
    toast.success("Task removed");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-16">
      <h1 className="text-2xl font-semibold">Todo Basic</h1>
      <div className="mt-8">
        <form onSubmit={handleSubmit} className="flex w-full gap-4">
          <Input
            type="text"
            value={task}
            placeholder="Enter task"
            onChange={handleOnChange}
          />
          <Button type="submit" className="w-fit">
            Submit
          </Button>
        </form>
        <h2 className="mt-16 text-lg font-medium">Task list:</h2>
        <ul className="mt-8 flex flex-col gap-4">
          {taskList.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-md border px-4 py-2 shadow-md"
            >
              {item}
              <Button variant="destructive" onClick={() => handleRemove(index)}>
                X
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
