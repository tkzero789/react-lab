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
    <div>
      <h1 className="text-2xl font-semibold">Todo Local Storage</h1>
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
                handleOnClick();
              }}
            >
              Add
            </Button>
          </form>
          <ul className="flex flex-col gap-4">
            {taskList?.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded-md border p-2"
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
          <p className="text-sm font-medium">
            * The values of the keys are stored as a single string in
            localStorage.
          </p>
          <div className="flex flex-col gap-4">
            <Collapsible className="flex flex-col gap-4 rounded-md border p-2">
              <CollapsibleTrigger className="w-full px-2 text-start text-lg dark:rounded-sm dark:bg-background [[data-state=open]_&]:rounded-sm [[data-state=open]_&]:bg-stone-300 [[data-state=open]_&]:dark:bg-stone-700">
                Initialization
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                  {`  React.useEffect(() => {
    try {
      const storage = localStorage.getItem("tasks");
      setTaskList(storage ? JSON.parse(storage) : []);
    } catch (e) {
      console.error("Failed to parse tasks from localStorage", e);
    }
  }, []);
  `}
                </SyntaxHighlighter>
                <ul className="mt-4 flex list-inside list-disc flex-col gap-2">
                  <li>
                    Use{" "}
                    <span className="font-medium text-yellow-600">
                      getItem()
                    </span>{" "}
                    method to get the value from key &quot;tasks&quot; in
                    localStorage.
                  </li>
                  <li>
                    If there is no value in the key &quot;tasks&quot;, then{" "}
                    <span className="font-medium text-blue-600">taskList</span>{" "}
                    array will be initialized as an empty array.
                  </li>
                </ul>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="flex flex-col gap-4 rounded-md border p-2">
              <CollapsibleTrigger className="w-full px-2 text-start text-lg dark:rounded-sm dark:bg-background [[data-state=open]_&]:rounded-sm [[data-state=open]_&]:bg-stone-300 [[data-state=open]_&]:dark:bg-stone-700">
                Add task
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                  {`const handleOnClick = () => {
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
  };`}
                </SyntaxHighlighter>
                <ul className="mt-4 flex list-inside list-disc flex-col gap-2">
                  <li>
                    Use{" "}
                    <span className="font-medium text-yellow-600">
                      setItem()
                    </span>{" "}
                    method to add new task to the &quot;tasks&quot; key.
                  </li>
                  <li>
                    Use <span className="font-medium text-green-600">JSON</span>
                    .
                    <span className="font-medium text-yellow-600">
                      stringify
                    </span>{" "}
                    method to convert the{" "}
                    <span className="font-medium text-blue-600">newTasks</span>{" "}
                    array from a JavaScript array to a single string so that the
                    new array after adding a task can be stored in the
                    localStorage.
                  </li>
                </ul>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="flex flex-col gap-4 rounded-md border p-2">
              <CollapsibleTrigger className="w-full px-2 text-start text-lg dark:rounded-sm dark:bg-background [[data-state=open]_&]:rounded-sm [[data-state=open]_&]:bg-stone-300 [[data-state=open]_&]:dark:bg-stone-700">
                Remove task
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                  {`const handleDelete = (itemIndex: number) => {
    const itemList = [...taskList];
    itemList.splice(itemIndex, 1);
    setTaskList(itemList);
    localStorage.setItem("tasks", JSON.stringify(itemList));
    toast.info("Task removed");
  };`}
                </SyntaxHighlighter>
                <ul className="mt-4 flex list-inside list-disc flex-col gap-2">
                  <li>
                    After using the{" "}
                    <span className="font-medium text-yellow-600">splice</span>{" "}
                    method to remove the task,{" "}
                    <span className="font-medium text-yellow-600">
                      setTaskList
                    </span>
                    (<span className="font-medium text-blue-600">itemList</span>
                    ) to update the UI. Then use{" "}
                    <span className="font-medium text-yellow-600">
                      setItem()
                    </span>{" "}
                    method and{" "}
                    <span className="font-medium text-green-600">JSON</span>.
                    <span className="font-medium text-yellow-600">
                      stringify
                    </span>{" "}
                    to set a new value to the &quot;tasks&quot; key in
                    localStorage.
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
