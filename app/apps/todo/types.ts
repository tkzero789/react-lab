import { api } from "@/convex/_generated/api"
import { FunctionReturnType } from "convex/server"

export type Todo = FunctionReturnType<typeof api.todos.list>[number]
