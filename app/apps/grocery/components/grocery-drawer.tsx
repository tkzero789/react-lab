import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Id } from "@/convex/_generated/dataModel";
import type { Ingredient, Dish } from "../types";
import IngredientForm from "./ingredient-form";
import DishForm from "./dish-form";

type Tab = "ingredient" | "dish";

type Props = {
  ingredients: Ingredient[];
  dishes: Dish[];
  onAddIngredient: (args: {
    name: string;
    quantity: string;
    price: number;
    dishIds: Id<"dishes">[];
  }) => void;
  onAddDish: (args: { name: string }) => void;
  onRemoveDish: (id: Id<"dishes">) => void;
  onReset: () => void;
};

export default function GroceryDrawer({
  ingredients,
  dishes,
  onAddIngredient,
  onAddDish,
  onRemoveDish,
  onReset,
}: Props) {
  const [tab, setTab] = React.useState<Tab>("ingredient");

  return (
    <Drawer>
      <DrawerTrigger asChild className="fixed bottom-8 right-8">
        <Button>
          <Plus /> Add
        </Button>
      </DrawerTrigger>

      <DrawerContent className="mx-auto max-w-2xl">
        <VisuallyHidden>
          <DrawerHeader>
            <DrawerTitle>Add item</DrawerTitle>
          </DrawerHeader>
        </VisuallyHidden>
        <div className="p-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex h-10 w-fit items-center gap-1 rounded-xl bg-muted p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "hover:bg-background hover:text-foreground dark:hover:bg-foreground dark:hover:text-background",
                    tab === "ingredient" &&
                      "bg-background dark:bg-foreground dark:text-secondary-foreground",
                  )}
                  onClick={() => setTab("ingredient")}
                >
                  Ingredient
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "hover:bg-background hover:text-foreground dark:hover:bg-foreground dark:hover:text-background",
                    tab === "dish" &&
                      "bg-background dark:bg-foreground dark:text-secondary-foreground",
                  )}
                  onClick={() => setTab("dish")}
                >
                  Dish
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={onReset}>
                <RotateCcw />
                Reset
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {tab === "ingredient" ? (
                <IngredientForm
                  ingredients={ingredients}
                  dishes={dishes}
                  onAdd={onAddIngredient}
                />
              ) : (
                <DishForm
                  dishes={dishes}
                  onAdd={onAddDish}
                  onRemove={onRemoveDish}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
