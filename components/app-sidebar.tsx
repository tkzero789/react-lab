"use client";

import * as React from "react";
import {
  BookOpen,
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
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

// This is sample data.
const data = {
  navMain: [
    {
      title: "To-do app",
      url: "#",
      icon: ListChecks,
      isActive: true,
      items: [
        {
          title: "Basic",
          url: "/basic",
        },
        {
          title: "Local Storage",
          url: "/local",
        },
      ],
    },
    {
      title: "useEffect",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
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
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
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
  return (
    <Sidebar
      collapsible="none"
      {...props}
      className="sticky left-0 top-0 h-dvh"
    >
      <SidebarHeader className="flex items-center justify-center overflow-hidden p-4">
        <Button
          asChild
          className="w-fit bg-transparent text-2xl font-bold text-foreground hover:bg-transparent hover:text-foreground"
        >
          <Link href="/">React Lab</Link>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter className="p-4">
        <ThemeToggle />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
