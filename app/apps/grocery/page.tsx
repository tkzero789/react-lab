"use client";

import DashboardBreadcrumb from "../components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
import { pathClient } from "@/lib/path-client";
import { Authenticated, Unauthenticated } from "convex/react";
import SignInPrompt from "../components/sign-in-prompt";
import GroceryStats from "./components/grocery-stats";
import IngredientList from "./components/ingredient-list";
import GroceryDialog from "./components/grocery-dialog";

export default function GroceryPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          {
            title: "Apps",
            href: pathClient("/apps"),
          },
          {
            title: "Grocery",
          },
        ]}
      />
      <DashboardContainer className="max-w-2xl">
        <Unauthenticated>
          <SignInPrompt description="Sign in to add ingredients and dishes to your grocery list" />
        </Unauthenticated>
        <Authenticated>
          <div className="flex flex-col gap-4">
            <GroceryDialog />
            <GroceryStats />
            <IngredientList />
          </div>
        </Authenticated>
      </DashboardContainer>
    </>
  );
}
