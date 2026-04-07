import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import { Dish } from "@/types/grocery";


function normalize(str: string) {
  return str.replace(/\s+/g, "").toLowerCase();
}

type Props = {
  dishes: Dish[];
  onAdd: (args: { name: string }) => void;
  onRemove: (id: Id<"dishes">) => void;
};

export default function DishForm({ dishes, onAdd, onRemove }: Props) {
  const isMobile = useIsMobile();
  const [dishName, setDishName] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
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
    onAdd({ name: dishName.trim() });
    toast.success(`Added dish "${dishName.trim()}"`, {
      position: isMobile ? "top-center" : "bottom-right",
    });
    setDishName("");
  }

  function handleRemove(dishId: Id<"dishes">) {
    onRemove(dishId);
    toast.info("Dish deleted", {
      position: isMobile ? "top-center" : "bottom-right",
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
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
                      onClick={() => handleRemove(dish._id)}
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
          ))}
        </div>
      )}
    </>
  );
}
