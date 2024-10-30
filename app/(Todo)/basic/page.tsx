"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
      toast.info("Empty input");
      return;
    } else {
      setTaskList((prev) => [...prev, task]);
      setTask("");
      toast.success("New task added");
    }
  };

  // Delete task
  const handleDelete = (itemIndex: number) => {
    const itemList = [...taskList];
    itemList.splice(itemIndex, 1);
    setTaskList(itemList);
    toast.info("Task removed");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Todo Basic</h1>
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="flex h-fit flex-col gap-4 rounded-lg border bg-white p-4 shadow dark:bg-transparent">
          <h2 className="text-xl font-semibold">Todo list</h2>
          <form className="flex items-center gap-4">
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
          <ul className="flex flex-col gap-4">
            {taskList.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded-md border border-gray-400 p-2"
              >
                {item}
                <button onClick={() => handleDelete(index)}>
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex h-fit flex-col gap-4 rounded-lg border bg-white p-4 shadow dark:bg-transparent">
          <h2 className="text-xl font-semibold">How it work</h2>
          <div className="flex flex-col gap-4">
            <Collapsible className="flex flex-col gap-4 rounded-md border p-2">
              <CollapsibleTrigger className="w-full px-2 text-start text-lg [[data-state=open]_&]:rounded-sm [[data-state=open]_&]:bg-stone-300 [[data-state=open]_&]:dark:bg-stone-700">
                Add task
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                  {`const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  const handleOnClick = (task: string) => {
    if (task.trim() === "") {
      setTask("");
      return;
    } else {
      setTaskList((prev) => [...prev, task]);
      setTask("");
      toast.success("New task added");
    }
  };
  `}
                </SyntaxHighlighter>
                <ul className="mt-4 flex list-inside list-disc flex-col gap-2">
                  <li>
                    Use{" "}
                    <span className="font-medium text-green-600">
                      React.ChangeEvent&lt;HTMLInputElement&gt;
                    </span>{" "}
                    for input field.
                  </li>
                  <li>
                    Use{" "}
                    <span className="font-medium text-yellow-600">trim()</span>{" "}
                    method to check for empty and space character.
                  </li>
                </ul>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="flex flex-col gap-4 rounded-md border p-2">
              <CollapsibleTrigger className="w-full px-2 text-start text-lg [[data-state=open]_&]:rounded-sm [[data-state=open]_&]:bg-stone-300 [[data-state=open]_&]:dark:bg-stone-700">
                Remove task
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                  {`const handleDelete = (itemIndex: number) => {
    const itemList = [...taskList];
    itemList.splice(itemIndex, 1);
    setTaskList(itemList);
    toast.info("Task removed");
  };`}
                </SyntaxHighlighter>
                <ul className="mt-4 flex list-inside list-disc flex-col gap-2">
                  <li>
                    Use{" "}
                    <span className="font-medium text-yellow-600">
                      splice()
                    </span>{" "}
                    method to directly modify the original taskList array to
                    increase performance instead of using{" "}
                    <span className="font-medium text-yellow-600">
                      filter()
                    </span>{" "}
                    method.
                  </li>
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
}
