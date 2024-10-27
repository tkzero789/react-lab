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

export default function Page() {
  const [task, setTask] = React.useState<string>("");
  const [taskList, setTaskList] = React.useState<string[]>([]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <div className="flex h-fit flex-col gap-4 rounded-lg border border-gray-300 bg-white p-4 dark:bg-transparent">
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
        <div className="flex h-fit flex-col gap-4 rounded-lg border border-gray-300 bg-white p-4 dark:bg-transparent">
          <h2 className="text-xl font-semibold">How it work</h2>
          <div className="flex flex-col gap-4">
            <Collapsible className="flex flex-col gap-4 rounded-md border p-2">
              <CollapsibleTrigger className="w-full text-start text-lg">
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
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="flex flex-col gap-4 rounded-md border p-2">
              <CollapsibleTrigger className="w-full text-start text-lg">
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
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
}
