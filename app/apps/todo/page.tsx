"use client"

import DashboardBreadcrumb from "../components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { pathClient } from "@/lib/path-client"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import SignInPrompt from "../components/sign-in-prompt"

import TodoList from "./components/todo-list"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { PlusIcon } from "lucide-react"
import React from "react"
import Loader from "@/components/ui/loader"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsListWrapper,
  TabsTrigger,
} from "@/components/ui/tabs"
import TodoSheet from "./components/todo-sheet"
import { Button } from "@/components/ui/button"

export default function TodoPage() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          {
            title: "Apps",
            href: pathClient("/apps"),
          },
          {
            title: "Todo",
          },
        ]}
      />
      <DashboardContainer className="p-0">
        <Unauthenticated>
          <SignInPrompt description="Add and manage your todos in one place" />
        </Unauthenticated>
        <AuthLoading>
          <Loader />
        </AuthLoading>
        <Authenticated>
          <Tabs defaultValue="todo" className="flex-1">
            <TabsListWrapper className="justify-between px-4 pt-4">
              <TabsList>
                <TabsTrigger value="todo" className="flex-1">
                  Todo
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex-1">
                  Completed
                </TabsTrigger>
              </TabsList>
              <Button
                onClick={() => setIsOpen(true)}
                className="active:scale-[0.95]"
              >
                <PlusIcon data-icon="inline-start" />
                Add Todo
              </Button>
              <TodoSheet open={isOpen} onOpenChange={setIsOpen} />
            </TabsListWrapper>
            <TabsContent value="todo">
              <TodoList />
            </TabsContent>
          </Tabs>
        </Authenticated>
      </DashboardContainer>
    </>
  )
}
