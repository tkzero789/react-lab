"use client";

import * as React from "react";
import { AppWindow, Bot, Laptop, ListChecks, PieChart } from "lucide-react";

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
      activeCheck: "/workshop/todo",
      items: [
        {
          title: "Basic",
          url: "/workshop/todo/basic",
        },
        {
          title: "Local Storage",
          url: "/workshop/todo/local",
        },
      ],
    },
    {
      title: "General app",
      url: "#",
      icon: AppWindow,
      activeCheck: "/workshop/general",
      items: [
        {
          title: "Weather app",
          url: "/workshop/general/weather",
        },
        {
          title: "Movie app",
          url: "/workshop/general/movie",
        },
      ],
    },
    {
      title: "Interview",
      url: "#",
      icon: Bot,
      activeCheck: "/workshop/interview",
      items: [
        {
          title: "Interview-1",
          url: "/workshop/interview/interview-1",
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
  const pathName = usePathname();

  const navWithActive = data.navMain.map((item) => ({
    ...item,
    isActive: pathName.startsWith(item.activeCheck),
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
          <Link href="/">Workshop</Link>
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
