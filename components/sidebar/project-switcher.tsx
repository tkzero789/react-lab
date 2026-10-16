/* Sidebar heading that names the current project and switches to another project */
"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import Link from "next/link"

import { projects, type ProjectId } from "@/components/sidebar/projects"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { pathClient } from "@/lib/path-client"

const projectEntries = Object.entries(projects) as [
  ProjectId,
  (typeof projects)[ProjectId],
][]

type Props = {
  project: ProjectId
}

export function ProjectSwitcher({ project }: Props) {
  const { name, icon: Icon } = projects[project]
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-popup-open:bg-muted data-popup-open:text-foreground"
              />
            }
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-foreground">
              <Icon className="size-4" />
            </div>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-semibold">{name}</span>
              <span className="truncate text-xs text-muted-foreground">
                React Lab
              </span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Projects</DropdownMenuLabel>
              {projectEntries.map(([id, item]) => (
                <DropdownMenuLinkItem
                  key={id}
                  closeOnClick
                  aria-current={id === project ? "page" : undefined}
                  render={
                    <Link
                      href={pathClient(item.url)}
                      onClick={() => setOpenMobile(false)}
                    />
                  }
                >
                  <item.icon />
                  {item.name}
                  {id === project && <Check className="ml-auto" />}
                </DropdownMenuLinkItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
