import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

type MovieType = {
  title: string;
  params?: "movie" | "series" | "hoathinh" | "tv-shows";
  typeList?: "phim-le" | "phim-bo" | "hoat-hinh" | "tv-shows";
};

const movieTypes: MovieType[] = [
  { title: "Home" },
  {
    title: "Movie",
    params: "movie",
    typeList: "phim-le",
  },
  {
    title: "Series",
    params: "series",
    typeList: "phim-bo",
  },
  {
    title: "Animation",
    params: "hoathinh",
    typeList: "hoat-hinh",
  },
  {
    title: "TV Shows",
    params: "tv-shows",
    typeList: "tv-shows",
  },
];

type Props = {
  paramsType: string;
};

export default function MovieMenu({ paramsType }: Props) {
  const isMobile = useIsMobile();

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
            {movieTypes.map((type) => (
              <Button
                key={type.title}
                asChild
                variant="muted"
                className={cn(
                  type.params === paramsType &&
                    "bg-primary text-primary-foreground",
                )}
              >
                <Link href={type?.params ? `/movie/${type?.params}` : `/movie`}>
                  {type.title}
                </Link>
              </Button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="lg:hidden">
          <Button variant="muted">
            <Menu /> Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          {movieTypes.map((type) => (
            <DropdownMenuItem
              key={type.title}
              asChild
              className={cn(type.params === paramsType && "bg-muted")}
            >
              <Link href={type?.params ? `/movie/${type?.params}` : `/movie`}>
                {type.title}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
