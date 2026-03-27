"use client";

import React from "react";
import { toast } from "sonner";
import DashboardBreadcrumb from "../components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import GroceryDrawer from "./components/grocery-drawer";
import GroceryStats from "./components/grocery-stats";
import IngredientList from "./components/ingredient-list";
import { pathClient } from "@/lib/path-client";

function normalize(str: string) {
  return str.replace(/\s+/g, "").toLowerCase();
}

export default function GroceryPage() {
  const isMobile = useIsMobile();
  const { data: session } = authClient.useSession();
  const isAuthenticated = !!session?.user;
  const ingredients =
    useQuery(api.ingredients.list, isAuthenticated ? {} : "skip") ?? [];
  const dishes = useQuery(api.dishes.list, isAuthenticated ? {} : "skip") ?? [];

  const addIngredient = useMutation(api.ingredients.add);
  const updateIngredient = useMutation(api.ingredients.update);
  const toggleIngredient = useMutation(api.ingredients.toggleChecked);
  const removeIngredient = useMutation(api.ingredients.remove);
  const removeAll = useMutation(api.ingredients.removeAll);
  const addDish = useMutation(api.dishes.add);
  const removeDish = useMutation(api.dishes.remove);

  function handleReset() {
    removeAll();
    toast.info("Grocery list cleared", {
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

  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[{ title: "Apps", href: "/apps" }, { title: "Grocery" }]}
      />
      <DashboardContainer className="max-w-3xl flex-1">
        {!isAuthenticated ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LogIn />
              </EmptyMedia>
              <EmptyTitle>Sign in to get started</EmptyTitle>
              <EmptyDescription>
                Log in to add ingredients and dishes to your grocery list.
              </EmptyDescription>
            </EmptyHeader>
            <Button
              variant="outline"
              onClick={() =>
                authClient.signIn.social({
                  provider: "google",
                  callbackURL: pathClient(""),
                })
              }
            >
              Sign in with Google
            </Button>
          </Empty>
        ) : (
          <div className="flex flex-col gap-4">
            <GroceryDrawer
              ingredients={ingredients}
              dishes={dishes}
              onAddIngredient={(args) => addIngredient(args)}
              onAddDish={(args) => addDish(args)}
              onRemoveDish={(id) => removeDish({ id })}
              onReset={handleReset}
            />

            {ingredients.length > 0 && (
              <>
                <GroceryStats ingredients={ingredients} />
                <IngredientList
                  ingredients={ingredients}
                  dishes={dishes}
                  onToggle={handleToggle}
                  onRemove={handleRemove}
                  onEdit={handleEdit}
                />
              </>
            )}
          </div>
        )}
      </DashboardContainer>
    </>
  );
}
