"use client";

import * as React from "react";
import { CassetteTape, Laptop, ListChecks, Map, PieChart } from "lucide-react";
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
      url: "/apps/todo",
      icon: ListChecks,
    },
    {
      name: "Weather",
      url: "/apps/weather",
      icon: Map,
    },
    {
      name: "Movie",
      url: "/apps/movie",
      icon: CassetteTape,
    },
  ],
  projects: [
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
