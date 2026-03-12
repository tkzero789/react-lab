"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardBreadcrumb from "../components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
import { appPathClient } from "@/lib/paths-client";
import { Check, Pencil, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "grocery-app";

type Ingredient = {
  id: string;
  name: string;
  quantity: string;
  price: number;
  checked: boolean;
  dishIds: string[];
};

type Dish = {
  id: string;
  name: string;
};

type Tab = "ingredient" | "dish";

function normalize(str: string) {
  return str.replace(/\s+/g, "").toLowerCase();
}

function loadFromStorage(): {
  ingredients: Ingredient[];
  dishes: Dish[];
} {
  if (typeof window === "undefined") return { ingredients: [], dishes: [] };
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return { ingredients: [], dishes: [] };
}

export default function GroceryPage() {
  const [ingredients, setIngredients] = React.useState<Ingredient[]>(
    () => loadFromStorage().ingredients,
  );
  const [dishes, setDishes] = React.useState<Dish[]>(
    () => loadFromStorage().dishes,
  );
  const [tab, setTab] = React.useState<Tab>("ingredient");

  // Persist to localStorage (remove key when empty)
  React.useEffect(() => {
    if (ingredients.length === 0 && dishes.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ingredients, dishes }));
  }, [ingredients, dishes]);

  function handleReset() {
    setIngredients([]);
    setDishes([]);
    setSelectedDishIds([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.info("Grocery list cleared");
  }

  // Ingredient form
  const [name, setName] = React.useState("");
  const [qty, setQty] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [selectedDishIds, setSelectedDishIds] = React.useState<string[]>([]);

  // Dish form
  const [dishName, setDishName] = React.useState("");

  function handleAddIngredient(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Ingredient name is required");
      return;
    }
    if (!price.trim()) {
      toast.error("Price is required");
      return;
    }
    const isDuplicate = ingredients.some(
      (i) => normalize(i.name) === normalize(name),
    );
    if (isDuplicate) {
      toast.error(`"${name}" already exists in your list`);
      return;
    }
    setIngredients((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        quantity: qty.trim() || "1",
        price: Number(price) || 0,
        checked: false,
        dishIds: selectedDishIds,
      },
    ]);
    toast.success(`Added "${name.trim()}"`);
    setName("");
    setQty("");
    setPrice("");
    setSelectedDishIds([]);
  }

  function handleAddDish(e: React.FormEvent) {
    e.preventDefault();
    if (!dishName.trim()) {
      toast.error("Dish name is required");
      return;
    }
    const isDuplicate = dishes.some(
      (d) => normalize(d.name) === normalize(dishName),
    );
    if (isDuplicate) {
      toast.error(`"${dishName}" already exists`);
      return;
    }
    setDishes((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: dishName.trim() },
    ]);
    toast.success(`Added dish "${dishName.trim()}"`);
    setDishName("");
  }

  function handleRemoveDish(dishId: string) {
    setDishes((prev) => prev.filter((d) => d.id !== dishId));
    // Remove dish reference from all ingredients
    setIngredients((prev) =>
      prev.map((i) => ({
        ...i,
        dishIds: i.dishIds.filter((id) => id !== dishId),
      })),
    );
    toast.info("Dish removed");
  }

  function handleToggle(id: string) {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
    );
  }

  function handleRemove(id: string) {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
    toast.info("Ingredient removed");
  }

  function handleEdit(
    id: string,
    updates: {
      name: string;
      quantity: string;
      price: number;
      dishIds: string[];
    },
  ) {
    const isDuplicate = ingredients.some(
      (i) => i.id !== id && normalize(i.name) === normalize(updates.name),
    );
    if (isDuplicate) {
      toast.error(`"${updates.name}" already exists in your list`);
      return false;
    }
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    );
    toast.success("Ingredient updated");
    return true;
  }

  function toggleDishSelection(dishId: string) {
    setSelectedDishIds((prev) =>
      prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId],
    );
  }

  const total = ingredients.reduce((sum, i) => sum + i.price, 0);
  const checkedTotal = ingredients
    .filter((i) => i.checked)
    .reduce((sum, i) => sum + i.price, 0);

  // Group: standalone + by dish
  const standalone = ingredients.filter((i) => i.dishIds.length === 0);
  const dishGroups = dishes.map((dish) => ({
    dish,
    items: ingredients.filter((i) => i.dishIds.includes(dish.id)),
  }));

  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Apps", href: appPathClient("/apps") },
          { title: "Grocery" },
        ]}
      />
      <DashboardContainer className="max-w-3xl">
        <div className="flex flex-col gap-4">
          {/* Add card with tabs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex h-10 w-fit items-center gap-1 rounded-xl bg-muted p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "hover:bg-background hover:text-foreground",
                    tab === "ingredient" && "bg-background shadow-sm",
                  )}
                  onClick={() => setTab("ingredient")}
                >
                  Ingredient
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "hover:bg-background hover:text-foreground",
                    tab === "dish" && "bg-background shadow-sm",
                  )}
                  onClick={() => setTab("dish")}
                >
                  Dish
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw />
                Reset
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {tab === "ingredient" ? (
                <>
                  <form
                    onSubmit={handleAddIngredient}
                    className="flex flex-col gap-2 sm:flex-row sm:items-center"
                  >
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ingredient name"
                      className="flex-1"
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
                  {/* Dish assignment */}
                  {dishes.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm text-muted-foreground">
                        Assign to dish (optional):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {dishes.map((dish) => (
                          <Button
                            key={dish.id}
                            type="button"
                            variant={
                              selectedDishIds.includes(dish.id)
                                ? "primary"
                                : "muted"
                            }
                            size="sm"
                            onClick={() => toggleDishSelection(dish.id)}
                          >
                            {dish.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <form
                    onSubmit={handleAddDish}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      placeholder="Dish name (e.g. Spaghetti Bolognese)"
                      className="flex-1"
                    />
                    <Button type="submit">
                      <Plus className="size-4" />
                      Add
                    </Button>
                  </form>
                  {dishes.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {dishes.map((dish) => (
                        <div
                          key={dish.id}
                          className="flex items-center justify-between rounded-xl bg-muted px-4 py-2 text-sm"
                        >
                          <span className="font-medium">{dish.name}</span>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleRemoveDish(dish.id)}
                          >
                            <X />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Grocery list */}
          {ingredients.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  Grocery List ({ingredients.length} item
                  {ingredients.length !== 1 ? "s" : ""})
                </CardTitle>
                <div className="text-right text-sm">
                  <div className="text-muted-foreground">
                    Checked: ${checkedTotal.toFixed(2)}
                  </div>
                  <div className="font-semibold">
                    Total: ${total.toFixed(2)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Standalone ingredients */}
                {standalone.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {dishes.length > 0 && (
                      <div className="text-sm font-medium text-muted-foreground">
                        Individual items
                      </div>
                    )}
                    {standalone.map((item) => (
                      <IngredientRow
                        key={item.id}
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

                {/* Grouped by dish */}
                {dishGroups.map(
                  ({ dish, items }) =>
                    items.length > 0 && (
                      <div key={dish.id} className="flex flex-col gap-2">
                        <div className="text-sm font-medium text-muted-foreground">
                          {dish.name}
                        </div>
                        {items.map((item) => (
                          <IngredientRow
                            key={`${dish.id}-${item.id}`}
                            item={item}
                            allDishes={dishes}
                            otherDishes={dishes.filter(
                              (d) =>
                                d.id !== dish.id && item.dishIds.includes(d.id),
                            )}
                            onToggle={handleToggle}
                            onRemove={handleRemove}
                            onEdit={handleEdit}
                          />
                        ))}
                      </div>
                    ),
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardContainer>
    </>
  );
}

function IngredientRow({
  item,
  allDishes,
  otherDishes,
  onToggle,
  onRemove,
  onEdit,
}: {
  item: Ingredient;
  allDishes: Dish[];
  otherDishes: Dish[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (
    id: string,
    updates: {
      name: string;
      quantity: string;
      price: number;
      dishIds: string[];
    },
  ) => boolean;
}) {
  const [editing, setEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(item.name);
  const [editQty, setEditQty] = React.useState(item.quantity);
  const [editPrice, setEditPrice] = React.useState(String(item.price));
  const [editDishIds, setEditDishIds] = React.useState(item.dishIds);

  function handleSave() {
    if (!editName.trim()) {
      toast.error("Ingredient name is required");
      return;
    }
    if (!editPrice.trim()) {
      toast.error("Price is required");
      return;
    }
    const success = onEdit(item.id, {
      name: editName.trim(),
      quantity: editQty.trim() || "1",
      price: Number(editPrice) || 0,
      dishIds: editDishIds,
    });
    if (success) setEditing(false);
  }

  function handleCancel() {
    setEditName(item.name);
    setEditQty(item.quantity);
    setEditPrice(String(item.price));
    setEditDishIds(item.dishIds);
    setEditing(false);
  }

  function toggleEditDish(dishId: string) {
    setEditDishIds((prev) =>
      prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId],
    );
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border bg-background px-4 py-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Name"
            className="flex-1"
          />
          <Input
            value={editQty}
            onChange={(e) => setEditQty(e.target.value)}
            placeholder="Qty"
            className="w-full sm:w-20"
          />
          <Input
            type="number"
            step="0.01"
            min="0"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            placeholder="Price"
            className="w-full sm:w-24"
          />
        </div>
        {allDishes.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-muted-foreground">
              Assign to dish:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {allDishes.map((dish) => (
                <Button
                  key={dish.id}
                  type="button"
                  variant={editDishIds.includes(dish.id) ? "primary" : "muted"}
                  size="sm"
                  onClick={() => toggleEditDish(dish.id)}
                >
                  {dish.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="size-4" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Check className="size-4" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border bg-background px-4 py-2 transition-all hover:shadow-sm">
      <Input
        type="checkbox"
        checked={item.checked}
        onChange={() => onToggle(item.id)}
        className="size-4 shrink-0 cursor-pointer accent-primary"
      />
      <div
        className={cn(
          "flex flex-1 items-center justify-between",
          item.checked && "text-muted-foreground line-through",
        )}
      >
        <div className="flex flex-col">
          <span className="font-medium">{item.name}</span>
          <span className="text-xs text-muted-foreground">
            Qty: {item.quantity}
            {otherDishes.length > 0 && (
              <>
                {" "}
                &middot; Also in: {otherDishes.map((d) => d.name).join(", ")}
              </>
            )}
          </span>
        </div>
        <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
      </div>
      <div className="flex items-center">
        <Button variant="ghost" size="icon-sm" onClick={() => setEditing(true)}>
          <Pencil />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
