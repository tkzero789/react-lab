import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Weather() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Weather app</h1>
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="flex h-fit flex-col gap-4 rounded-lg border bg-white p-4 shadow dark:bg-transparent">
          <h2 className="text-xl font-semibold">Weather info</h2>
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
