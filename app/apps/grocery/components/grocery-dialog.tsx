import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import IngredientForm from "./ingredient-form";
import DishForm from "./dish-form";

type Tab = "ingredient" | "dish";

export default function GroceryDialog() {
  const isMobile = useIsMobile();
  const [tab, setTab] = React.useState<Tab>("ingredient");
  const removeAll = useMutation(api.ingredients.removeAll);

  function handleReset() {
    removeAll();
    toast.info("Grocery list cleared", {
      position: isMobile ? "top-center" : "bottom-right",
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild className="fixed bottom-8 right-8">
        <Button>
          <Plus /> Add
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add item</DialogTitle>
        </DialogHeader>
        <DialogBody>
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
              {tab === "ingredient" ? <IngredientForm /> : <DishForm />}
            </CardContent>
          </Card>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
