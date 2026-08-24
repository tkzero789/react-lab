import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"
import { pathClient } from "@/lib/path-client"
import { MOVIE_BROWSE } from "../movie"

const menuTabs = [{ segment: undefined, title: "Home" }, ...MOVIE_BROWSE]

type Props = {
  paramsType: string
}

export default function MovieMenu({ paramsType }: Props) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="muted">
            <Menu />
            Menu
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <div className="grid grid-cols-2 gap-2 px-4 pb-4">
            {menuTabs.map((tab) => (
              <Link
                key={tab.title}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  tab.segment === paramsType &&
                    "bg-primary text-primary-foreground"
                )}
                href={pathClient(
                  tab.segment ? `/apps/movie/${tab.segment}` : `/apps/movie`
                )}
              >
                {tab.title}
              </Link>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    )
  } else {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className="lg:hidden"
          render={
            <Button variant="muted">
              <Menu /> Menu
            </Button>
          }
        ></DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          {menuTabs.map((tab) => (
            <DropdownMenuItem
              key={tab.title}
              className={cn(tab.segment === paramsType && "bg-muted")}
              render={
                <Link
                  href={pathClient(
                    tab.segment ? `/apps/movie/${tab.segment}` : `/apps/movie`
                  )}
                >
                  {tab.title}
                </Link>
              }
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
}
