// import { mutation } from "./_generated/server";

// export const renameTodoNameToText = mutation({
//   handler: async (ctx) => {
//     const todos = await ctx.db.query("todos").collect();
//     for (const todo of todos) {
//       await ctx.db.patch(todo._id, {
//         text: todo.name,
//         name: undefined, // removes the field
//       });
//     }
//     return `Migrated ${todos.length} todos`;
//   },
// });
