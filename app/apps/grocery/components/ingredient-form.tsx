import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

function normalize(str: string) {
  return str.replace(/\s+/g, "").toLowerCase();
}

export default function IngredientForm() {
  const isMobile = useIsMobile();
  const ingredients = useQuery(api.ingredients.list) ?? [];
  const dishes = useQuery(api.dishes.list) ?? [];
  const addIngredient = useMutation(api.ingredients.add);

  const [name, setName] = React.useState("");
  const [qty, setQty] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [selectedDishIds, setSelectedDishIds] = React.useState<Id<"dishes">[]>(
    [],
  );

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Item name is required", {
        position: isMobile ? "top-center" : "bottom-right",
      });
      return;
    }
    const isDuplicate = ingredients.some(
      (i) => normalize(i.name) === normalize(name),
    );
    if (isDuplicate) {
      toast.error(`"${name}" already exists in your list`, {
        position: isMobile ? "top-center" : "bottom-right",
      });
      return;
    }
    addIngredient({
      name: name.trim(),
      quantity: qty.trim() || "1",
      price: Number(price) || 0,
      dishIds: selectedDishIds,
    });
    toast.success(`Added "${name.trim()}"`, {
      position: isMobile ? "top-center" : "bottom-right",
    });
    setName("");
    setQty("");
    setPrice("");
    setSelectedDishIds([]);
  }

  function toggleDishSelection(dishId: Id<"dishes">) {
    setSelectedDishIds((prev) =>
      prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId],
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 sm:flex-row sm:items-center"
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ingredient"
        />
        <Input
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          placeholder="Qty"
          className="w-full sm:w-20"
        />
        <Input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full sm:w-24"
        />
        <Button type="submit">
          <Plus className="size-4" />
          Add
        </Button>
      </form>
      {dishes.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-muted-foreground">List of dishes:</span>
          <div className="flex flex-wrap gap-1.5">
            {dishes.map((dish) => (
              <Button
                key={dish._id}
                type="button"
                variant={
                  selectedDishIds.includes(dish._id) ? "primary" : "muted"
                }
                size="sm"
                onClick={() => toggleDishSelection(dish._id)}
              >
                {dish.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
