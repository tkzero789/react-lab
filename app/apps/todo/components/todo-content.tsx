import { preloadAuthQuery } from "@/lib/auth-server";
import TodoForm from "./todo-form";
import TodoList from "./todo-list";
import { api } from "@/convex/_generated/api";

export default async function TodoContent() {
  const preloadTodos = await preloadAuthQuery(api.todos.list);

  return (
    <div className="flex flex-col gap-4">
      <TodoForm />
      <TodoList preloadedTodos={preloadTodos} />
    </div>
  );
}
