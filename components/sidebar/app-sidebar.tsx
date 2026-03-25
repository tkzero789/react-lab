"use client";

import * as React from "react";
import {
  AppWindow,
  CloudSun,
  Dumbbell,
  Film,
  Laptop,
  ListChecks,
  PieChart,
  ShoppingBasket,
} from "lucide-react";
import { NavApps } from "./nav-app";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { ThemeToggle } from "../theme/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarUser } from "./sidebar-user";

const sidebarItems = {
  apps: [
    {
      name: "Todo",
      url: "/apps/todo",
      icon: ListChecks,
    },
    {
      name: "Weather",
      url: "/apps/weather",
      icon: CloudSun,
    },
    {
      name: "Movie",
      url: "/apps/movie",
      icon: Film,
    },
    {
      name: "Grocery",
      url: "/apps/grocery",
      icon: ShoppingBasket,
    },
    {
      name: "Workout",
      url: "/apps/workout",
      icon: Dumbbell,
    },
  ],
  projects: [
    { name: "Apps", url: "/apps", icon: AppWindow },
    {
      name: "Web Replicas",
      url: "/replicas",
      icon: Laptop,
    },
    {
      name: "ThreeJS",
      url: "/threejs",
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarUser />
      </SidebarHeader>
      <SidebarContent>
        <NavApps apps={sidebarItems.apps} />
        <NavProjects projects={sidebarItems.projects} />
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2 p-4">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
