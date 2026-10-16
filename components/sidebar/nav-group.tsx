/* Labeled group of sidebar links that marks the link for the current page */
"use client"

import { type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { pathClient } from "@/lib/path-client"

export type NavItem = {
  name: string
  url: string
  icon?: LucideIcon
}

type Props = {
  label: string
  items: NavItem[]
}

/* Match on a segment boundary so /design-system/input is not active on /design-system/input-group */
function isActive(pathName: string, url: string) {
  return pathName === url || pathName.startsWith(`${url}/`)
}

export function NavGroup({ label, items }: Props) {
  const pathName = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const url = pathClient(item.url)
          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                isActive={isActive(pathName, url)}
                render={<Link href={url} onClick={() => setOpenMobile(false)} />}
              >
                {item.icon && <item.icon />}
                <span>{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
