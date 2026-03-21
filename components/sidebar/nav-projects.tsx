"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { pathClient } from "@/lib/path-client";

type ProjectSidebar = {
  name: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
};

type Props = {
  projects: ProjectSidebar[];
};

export function NavProjects({ projects }: Props) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project: ProjectSidebar) => (
          <SidebarMenuItem key={project.name}>
            <SidebarMenuButton asChild isActive={project.isActive}>
              <Link href={pathClient(project.url)}>
                <project.icon />
                <span>{project.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
