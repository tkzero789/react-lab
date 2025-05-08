"use client";

import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import styles from "../scss/todo.module.scss";

export default function LocalStorage() {
  const [task, setTask] = React.useState<string>("");
  const [taskList, setTaskList] = React.useState<string[]>([]);

  // Get value from tasks key or empty array
  React.useEffect(() => {
    const storage = localStorage.getItem("tasks");
    setTaskList(storage ? JSON.parse(storage) : []);
  }, []);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  // Add task
  const handleOnClick = () => {
    if (task.trim() === "") {
      setTask("");
      toast.error("Empty input");
      return;
    } else {
      const newTasks = [...taskList, task];
      setTaskList(newTasks);
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      setTask("");
      toast.success("New task added");
    }
  };

  // Delete task
  const handleDelete = (itemIndex: number) => {
    const itemList = [...taskList];
    itemList.splice(itemIndex, 1);
    setTaskList(itemList);
    localStorage.setItem("tasks", JSON.stringify(itemList));
    toast.info("Task removed");
  };

  return (
    <>
      <h1 className="text-2xl font-semibold">Todo Local Storage</h1>
      <div className="mt-8">
        <Container>
          <div
            className={`mx-auto h-fit max-w-2xl rounded-2xl bg-neutral-100 p-2 ${styles.fadeInCard}`}
          >
            <h2 className="p-2 text-lg font-semibold">Add todo</h2>
            <form className="flex items-center gap-2">
              <Input
                value={task}
                onChange={handleOnChange}
                placeholder="Enter task"
              />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleOnClick();
                }}
              >
                Add
              </Button>
            </form>
            {taskList && taskList.length > 0 && (
              <div className="mt-4">
                <h2 className="p-2 text-lg font-semibold">Todo list</h2>
                <ul className="flex flex-col gap-4">
                  {taskList?.map((item, index) => (
                    <li
                      key={index}
                      className={`flex items-center justify-between rounded-xl border border-neutral-300 bg-white px-4 py-2 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:shadow ${styles.fadeInTodo}`}
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
          </div>
        </Container>
      </div>
    </>
  );
}
