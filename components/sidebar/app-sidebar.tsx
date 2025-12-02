"use client";

import * as React from "react";
import { CassetteTape, Laptop, ListChecks, Map, PieChart } from "lucide-react";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { Button } from "../ui/button";
import Link from "next/link";
import { ThemeToggle } from "../theme/theme-toggle";
import { NavApps } from "./nav-app";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

const sidebarItems = {
  apps: [
    {
      name: "Todo",
      url: "/app/todo",
      icon: ListChecks,
    },
    {
      name: "Weather",
      url: "/app/weather",
      icon: Map,
    },
    {
      name: "Movie",
      url: "/app/movie",
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
    <Sidebar
      collapsible="icon"
      {...props}
      className="sticky left-0 top-0 hidden h-dvh group-data-[side=left]:border-r-0 xl:block"
    >
      <SidebarHeader className="flex items-center overflow-hidden p-4">
        <Button
          asChild
          className="w-fit bg-transparent text-2xl font-bold text-foreground hover:bg-transparent hover:text-foreground"
        >
          <Link href="/">Apps</Link>
        </Button>
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
