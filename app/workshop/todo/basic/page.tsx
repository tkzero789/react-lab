"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import styles from "../scss/todo.module.scss";
import Container from "@/components/layout/container";

export default function Basic() {
  const [task, setTask] = React.useState<string>("");
  const [taskList, setTaskList] = React.useState<string[]>([]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  // Add task
  const handleOnClick = (task: string) => {
    if (task.trim() === "") {
      setTask("");
      toast.error("Empty input");
      return;
    } else {
      setTaskList((prev) => [...prev, task]);
      setTask("");
      toast.success("New task added");
    }
  };

  // Delete task
  const handleDelete = (itemIndex: number) => {
    setTaskList(taskList.filter((_, index) => index !== itemIndex));
    toast.info("Task removed");
  };

  return (
    <Container className="max-w-2xl">
      <h1>Todo basic</h1>
      <Card className={`mt-8 ${styles.fadeInCard}`}>
        <CardHeader>
          <CardTitle>Add todo</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex items-center gap-2">
            <Input
              value={task}
              onChange={handleOnChange}
              placeholder="Enter task"
            />
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleOnClick(task);
              }}
            >
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
      {taskList && taskList.length > 0 && (
        <div className="mt-4">
          <h2 className="p-2">Todo list</h2>
          <ul className="flex flex-col gap-4">
            {taskList.map((item, index) => (
              <li
                key={index}
                className={`flex items-center justify-between rounded-xl border bg-background px-4 py-2 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:shadow ${styles.fadeInTodo}`}
              >
                {item}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(index)}
                  className="size-8"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}
