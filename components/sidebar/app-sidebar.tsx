"use client";

import * as React from "react";
import {
  AppWindow,
  CloudSun,
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
import { TeamSwitcher } from "./team-switcher";

const sidebarItems = {
  apps: [
    {
      name: "Todo",
      url: "/todo",
      icon: ListChecks,
    },
    {
      name: "Weather",
      url: "/weather",
      icon: CloudSun,
    },
    {
      name: "Movie",
      url: "/movie",
      icon: Film,
    },
    {
      name: "Grocery",
      url: "/grocery",
      icon: ShoppingBasket,
    },
  ],
  projects: [
    { name: "Apps", url: "/", icon: AppWindow },
    {
      name: "Web Replicas",
      url: "#",
      icon: Laptop,
    },
    {
      name: "ThreeJS",
      url: "#",
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavApps apps={sidebarItems.apps} />
        <NavProjects projects={sidebarItems.projects} />
      </SidebarContent>
      <SidebarFooter className="p-4">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
