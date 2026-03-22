import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import type { Ingredient, Dish } from "../types";
import IngredientRow from "./ingredient-row";

type Props = {
  ingredients: Ingredient[];
  dishes: Dish[];
  onToggle: (id: Id<"ingredients">) => void;
  onRemove: (id: Id<"ingredients">) => void;
  onEdit: (
    id: Id<"ingredients">,
    updates: {
      name: string;
      quantity: string;
      price: number;
      dishIds: Id<"dishes">[];
    },
  ) => boolean;
};

export default function IngredientList({
  ingredients,
  dishes,
  onToggle,
  onRemove,
  onEdit,
}: Props) {
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
            <IngredientRow
              key={item._id}
              item={item}
              allDishes={dishes}
              otherDishes={[]}
              onToggle={onToggle}
              onRemove={onRemove}
              onEdit={onEdit}
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
                  <IngredientRow
                    key={`${dish._id}-${item._id}`}
                    item={item}
                    allDishes={dishes}
                    otherDishes={dishes.filter(
                      (d) =>
                        d._id !== dish._id && item.dishIds.includes(d._id),
                    )}
                    onToggle={onToggle}
                    onRemove={onRemove}
                    onEdit={onEdit}
                  />
                ))}
              </CardContent>
            </Card>
          ),
      )}
    </div>
  );
}
