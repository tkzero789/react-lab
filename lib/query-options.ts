import { convexQuery } from "@convex-dev/react-query"
import { api } from "@/convex/_generated/api"

// `convexQuery` returns a complete { queryKey, queryFn, gcTime } object derived
// from the Convex function reference + args — no hand-written keys needed.
export const todoQueries = {
  list: () => convexQuery(api.todos.list, {}),
}
