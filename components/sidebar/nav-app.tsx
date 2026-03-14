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
import Link from "next/link";

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

  const activeAppSidebar = apps.map((app, i) => ({
    ...app,
    isActive: pathName.startsWith(apps[i].url),
  }));

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Apps</SidebarGroupLabel>
      <SidebarMenu>
        {activeAppSidebar.map((app: AppSidebar) => (
          <SidebarMenuItem key={app.name}>
            <SidebarMenuButton asChild isActive={app.isActive}>
              <Link href={app.url}>
                <app.icon />
                <span>{app.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
