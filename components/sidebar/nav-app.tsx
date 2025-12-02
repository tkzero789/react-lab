"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

type AppSidebar = {
  name: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
};

type Props = {
  apps: AppSidebar[];
};

export function NavApps({ apps }: Props) {
  const pathName = usePathname();

  const activeAppSidebar = apps.map((app) => ({
    ...app,
    isActive: pathName.startsWith(app.url),
  }));

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {activeAppSidebar.map((app: AppSidebar) => (
          <SidebarMenuItem key={app.name}>
            <SidebarMenuButton asChild isActive={app.isActive}>
              <a href={app.url}>
                <app.icon />
                <span>{app.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
