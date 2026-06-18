"use client"

import DashboardBreadcrumb from "../components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { pathClient } from "@/lib/path-client"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import SignInPrompt from "../components/sign-in-prompt"
import TodoForm from "./components/todo-form"
import TodoList from "./components/todo-list"
import Container from "@/components/layout/container"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"
import Loader from "@/components/ui/loader"

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
      <DashboardContainer className="max-w-xl p-0">
        <Unauthenticated>
          <SignInPrompt description="Add and manage your todos in one place" />
        </Unauthenticated>
        <AuthLoading>
          <Loader />
        </AuthLoading>
        <Authenticated>
          <Container className="flex flex-col gap-4 py-4">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger
                nativeButton={false}
                render={
                  <InputGroup>
                    <InputGroupInput placeholder="Enter todo" />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton size="icon-sm">
                        <PlusIcon />
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                }
              ></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add todo</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <TodoForm onSuccess={() => setIsOpen(false)} />
                </DialogBody>
                <DialogFooter>
                  <Button form="addTodo" type="submit" className="w-full">
                    Add
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <TodoList />
          </Container>
        </Authenticated>
      </DashboardContainer>
    </>
  )
}
