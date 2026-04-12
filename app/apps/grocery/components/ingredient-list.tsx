"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import IngredientItem from "./ingredient-item";

function normalize(str: string) {
  return str.replace(/\s+/g, "").toLowerCase();
}

export default function IngredientList() {
  const isMobile = useIsMobile();
  const ingredients = useQuery(api.ingredients.list) ?? [];
  const dishes = useQuery(api.dishes.list) ?? [];

  const toggleIngredient = useMutation(api.ingredients.toggleChecked);
  const removeIngredient = useMutation(api.ingredients.remove);
  const updateIngredient = useMutation(api.ingredients.update);

  function handleToggle(id: Id<"ingredients">) {
    toggleIngredient({ id });
  }

  function handleRemove(id: Id<"ingredients">) {
    removeIngredient({ id });
    toast.info("Ingredient deleted", {
      position: isMobile ? "top-center" : "bottom-right",
    });
  }

  function handleEdit(
    id: Id<"ingredients">,
    updates: {
      name: string;
      quantity: string;
      price: number;
      dishIds: Id<"dishes">[];
    },
  ) {
    const isDuplicate = ingredients.some(
      (i) => i._id !== id && normalize(i.name) === normalize(updates.name),
    );
    if (isDuplicate) {
      toast.error(`"${updates.name}" already exists in your list`, {
        position: isMobile ? "top-center" : "bottom-right",
      });
      return false;
    }
    updateIngredient({ id, ...updates });
    toast.success("Ingredient updated", {
      position: isMobile ? "top-center" : "bottom-right",
    });
    return true;
  }

  const standalone = ingredients.filter((i) => i.dishIds.length === 0);
  const dishGroups = dishes.map((dish) => ({
    dish,
    items: ingredients.filter((i) => i.dishIds.includes(dish._id)),
  }));

  return (
    <div className="flex flex-col gap-4">
      {standalone.length > 0 && (
        <div className="flex flex-col gap-2">
          {dishes.length > 0 && (
            <div className="text-sm font-medium text-muted-foreground">
              Individual items
            </div>
          )}
          {standalone.map((item) => (
            <IngredientItem
              key={item._id}
              item={item}
              allDishes={dishes}
              otherDishes={[]}
              onToggle={handleToggle}
              onRemove={handleRemove}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {dishGroups.map(
        ({ dish, items }) =>
          items.length > 0 && (
            <Card key={dish._id}>
              <CardHeader>
                <CardTitle>{dish.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {items.map((item) => (
                  <IngredientItem
                    key={`${dish._id}-${item._id}`}
                    item={item}
                    allDishes={dishes}
                    otherDishes={dishes.filter(
                      (d) => d._id !== dish._id && item.dishIds.includes(d._id),
                    )}
                    onToggle={handleToggle}
                    onRemove={handleRemove}
                    onEdit={handleEdit}
                  />
                ))}
              </CardContent>
            </Card>
          ),
      )}
    </div>
  );
}
