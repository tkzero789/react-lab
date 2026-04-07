import { Id } from "@/convex/_generated/dataModel";

export type Ingredient = {
  _id: Id<"ingredients">;
  _creationTime: number;
  name: string;
  quantity: string;
  price: number;
  checked: boolean;
  dishIds: Id<"dishes">[];
  userId: Id<"users">;
};

export type Dish = {
  _id: Id<"dishes">;
  _creationTime: number;
  name: string;
  userId: Id<"users">;
};
