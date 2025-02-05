"use client";

import * as React from "react";
import {
  AppWindow,
  Bot,
  Frame,
  ListChecks,
  Map,
  PieChart,
  Settings2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { usePathname } from "next/navigation";

const data = {
  navMain: [
    {
      title: "To-do app",
      url: "#",
      icon: ListChecks,
      items: [
        {
          title: "Basic",
          url: "/todo/basic",
        },
        {
          title: "Local Storage",
          url: "/todo/local",
        },
      ],
    },
    {
      title: "General app",
      url: "#",
      icon: AppWindow,
      items: [
        {
          title: "Weather app",
          url: "/general/weather",
        },
        {
          title: "Movie app",
          url: "/general/movie?page=1",
        },
      ],
    },
    {
      title: "Interview",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Interview-1",
          url: "/interview/interview-1",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const path = usePathname();

  const navWithActive = data.navMain.map((item) => ({
    ...item,
    isActive: item.items?.some((subItem) => subItem.url === path),
  }));

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="sticky left-0 top-0 hidden h-dvh xl:block"
    >
      <SidebarHeader className="flex items-center overflow-hidden p-4">
        <Button
          asChild
          className="w-fit bg-transparent text-2xl font-bold text-foreground hover:bg-transparent hover:text-foreground"
        >
          <Link href="/">React Lab</Link>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navWithActive} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter className="p-4">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
