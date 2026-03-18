"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardBreadcrumb from "../components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
import { Check, Pencil, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type Ingredient = {
  _id: Id<"ingredients">;
  _creationTime: number;
  name: string;
  quantity: string;
  price: number;
  checked: boolean;
  dishIds: Id<"dishes">[];
};

type Dish = {
  _id: Id<"dishes">;
  _creationTime: number;
  name: string;
};

type Tab = "ingredient" | "dish";

function normalize(str: string) {
  return str.replace(/\s+/g, "").toLowerCase();
}

export default function GroceryPage() {
  const isMobile = useIsMobile();
  const ingredients = useQuery(api.ingredients.list) ?? [];
  const dishes = useQuery(api.dishes.list) ?? [];

  const addIngredient = useMutation(api.ingredients.add);
  const updateIngredient = useMutation(api.ingredients.update);
  const toggleIngredient = useMutation(api.ingredients.toggleChecked);
  const removeIngredient = useMutation(api.ingredients.remove);
  const removeAll = useMutation(api.ingredients.removeAll);
  const addDish = useMutation(api.dishes.add);
  const removeDish = useMutation(api.dishes.remove);

  const [tab, setTab] = React.useState<Tab>("ingredient");

  function handleReset() {
    removeAll();
    setSelectedDishIds([]);
    toast.info("Grocery list cleared", {
      position: isMobile ? "top-center" : "bottom-right",
    });
  }

  // Ingredient form
  const [name, setName] = React.useState("");
  const [qty, setQty] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [selectedDishIds, setSelectedDishIds] = React.useState<Id<"dishes">[]>(
    [],
  );

  // Dish form
  const [dishName, setDishName] = React.useState("");

  function handleAddIngredient(e: React.FormEvent) {
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

  function handleAddDish(e: React.FormEvent) {
    e.preventDefault();
    if (!dishName.trim()) {
      toast.error("Dish name is required", {
        position: isMobile ? "top-center" : "bottom-right",
      });
      return;
    }
    const isDuplicate = dishes.some(
      (d) => normalize(d.name) === normalize(dishName),
    );
    if (isDuplicate) {
      toast.error(`"${dishName}" already exists`, {
        position: isMobile ? "top-center" : "bottom-right",
      });
      return;
    }
    addDish({ name: dishName.trim() });
    toast.success(`Added dish "${dishName.trim()}"`, {
      position: isMobile ? "top-center" : "bottom-right",
    });
    setDishName("");
  }

  function handleRemoveDish(dishId: Id<"dishes">) {
    removeDish({ id: dishId });
    toast.info("Dish deleted", {
      position: isMobile ? "top-center" : "bottom-right",
    });
  }

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

  function toggleDishSelection(dishId: Id<"dishes">) {
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
    items: ingredients.filter((i) => i.dishIds.includes(dish._id)),
  }));

  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[{ title: "Apps", href: "/" }, { title: "Grocery" }]}
      />
      <DashboardContainer className="max-w-3xl flex-1">
        <div className="flex flex-col gap-4">
          {/* Add card with tabs */}
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
                        {/* Dish assignment */}
                        {dishes.length > 0 && (
                          <div className="flex flex-col gap-1.5">
                            <span className="text-sm text-muted-foreground">
                              List of dishes:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {dishes.map((dish) => (
                                <Button
                                  key={dish._id}
                                  type="button"
                                  variant={
                                    selectedDishIds.includes(dish._id)
                                      ? "primary"
                                      : "muted"
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
                    ) : (
                      <>
                        <form
                          onSubmit={handleAddDish}
                          className="flex items-center gap-2"
                        >
                          <Input
                            value={dishName}
                            onChange={(e) => setDishName(e.target.value)}
                            placeholder="Dish"
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
                                key={dish._id}
                                className="flex items-center justify-between rounded-xl bg-muted px-4 py-2 text-sm"
                              >
                                <span className="font-medium">{dish.name}</span>

                                <Drawer>
                                  <DrawerTrigger asChild>
                                    <Button variant="ghost" size="icon-sm">
                                      <Trash2 />
                                    </Button>
                                  </DrawerTrigger>
                                  <DrawerContent className="mx-auto max-w-2xl">
                                    <DrawerHeader>
                                      <DrawerTitle>{dish.name}</DrawerTitle>
                                    </DrawerHeader>
                                    <DrawerFooter>
                                      <Button
                                        variant="destructive"
                                        onClick={() =>
                                          handleRemoveDish(dish._id)
                                        }
                                      >
                                        Delete
                                      </Button>
                                      <DrawerClose>
                                        <Button
                                          variant="outline"
                                          className="w-full"
                                        >
                                          Cancel
                                        </Button>
                                      </DrawerClose>
                                    </DrawerFooter>
                                  </DrawerContent>
                                </Drawer>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Grocery list */}
          {ingredients.length > 0 && (
            <>
              {/* Total */}
              <div className="grid flex-1 grid-cols-3 rounded-xl bg-secondary p-4 text-secondary-foreground">
                <div className="flex flex-col items-center gap-1">
                  List
                  <span className="font-medium">
                    ({ingredients.length} item
                    {ingredients.length !== 1 ? "s" : ""})
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  Checked{" "}
                  <span className="font-medium">
                    ${checkedTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  Total <span className="font-medium">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
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

                {/* Grouped by dish */}
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
                                  d._id !== dish._id &&
                                  item.dishIds.includes(d._id),
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
            </>
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
}) {
  const isMobile = useIsMobile();
  const [editing, setEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(item.name);
  const [editQty, setEditQty] = React.useState(item.quantity);
  const [editPrice, setEditPrice] = React.useState(String(item.price));
  const [editDishIds, setEditDishIds] = React.useState<Id<"dishes">[]>(
    item.dishIds,
  );

  function handleSave() {
    if (!editName.trim()) {
      toast.error("Item name is required", {
        position: isMobile ? "top-center" : "bottom-right",
      });
      return;
    }
    const success = onEdit(item._id, {
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

  function toggleEditDish(dishId: Id<"dishes">) {
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
                  key={dish._id}
                  type="button"
                  variant={editDishIds.includes(dish._id) ? "primary" : "muted"}
                  size="sm"
                  onClick={() => toggleEditDish(dish._id)}
                >
                  {dish.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2">
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
    <div className="flex items-center gap-4 rounded-xl border bg-background px-4 py-2 transition-all">
      <Input
        type="checkbox"
        checked={item.checked}
        onChange={() => onToggle(item._id)}
        className="size-4 shrink-0 cursor-pointer"
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

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <Trash2 />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="mx-auto max-w-2xl">
            <DrawerHeader>
              <DrawerTitle>{item.name}</DrawerTitle>
            </DrawerHeader>
            <DrawerFooter>
              <Button
                variant="destructive"
                onClick={() => onRemove(item._id)}
              >
                Delete
              </Button>
              <DrawerClose>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
