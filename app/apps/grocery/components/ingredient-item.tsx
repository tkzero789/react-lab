import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
import { Id } from "@/convex/_generated/dataModel";
import { Dish, Ingredient } from "@/types/grocery";

type Props = {
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
};

export default function IngredientItem({
  item,
  allDishes,
  otherDishes,
  onToggle,
  onRemove,
  onEdit,
}: Props) {
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
            <Button variant="ghost-destructive" size="icon-sm">
              <Trash2 />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="mx-auto max-w-2xl">
            <DrawerHeader>
              <DrawerTitle>{item.name}</DrawerTitle>
            </DrawerHeader>
            <DrawerFooter>
              <Button variant="destructive" onClick={() => onRemove(item._id)}>
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
