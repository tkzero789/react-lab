import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type MovieFilter = {
  _id: string;
  name: string;
  slug: string;
};

export default function MovieFilter() {
  const isMobile = useIsMobile();

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [filter, setFilter] = React.useState<{
    category: MovieFilter[];
    country: MovieFilter[];
  }>();
  const [selectedFilter, setSelectedFilter] = React.useState<{
    category: MovieFilter | null;
    country: MovieFilter | null;
  }>({
    category: null,
    country: null,
  });

  React.useEffect(() => {
    const getFilterData = async () => {
      try {
        const categoryResponse = await fetch("https://phimapi.com/the-loai");
        const categoryData = await categoryResponse.json();

        const countryResponse = await fetch("https://phimapi.com/quoc-gia");
        const countryData = await countryResponse.json();

        setFilter({
          category: categoryData,
          country: countryData,
        });
      } catch (error) {
        console.error(error);
      }
    };

    getFilterData();
  }, []);

  const handleSelectFilter = (
    filterType: string,
    filterObject: MovieFilter,
  ) => {
    setSelectedFilter((prev) => ({
      ...prev,
      [filterType]: filterObject,
    }));
  };

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="muted">
            <Filter />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filter</DrawerTitle>
          </DrawerHeader>
          <div className="grid grid-cols-2 gap-4 px-4">
            <NativeSelect width="full" className="h-10 rounded-xl bg-muted">
              {filter?.category.map((item) => (
                <NativeSelectOption
                  key={item._id}
                  value={item.name}
                  onSelect={(e) => {
                    e.preventDefault();
                    handleSelectFilter("category", item);
                  }}
                  className={cn(
                    "pl-2",
                    selectedFilter.category?.slug === item.slug &&
                      "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  )}
                >
                  {item.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <NativeSelect width="full" className="h-10 rounded-xl bg-muted">
              {filter?.country.map((item) => (
                <NativeSelectOption
                  key={item._id}
                  value={item.name}
                  onSelect={(e) => {
                    e.preventDefault();
                    handleSelectFilter("category", item);
                  }}
                  className={cn(
                    "pl-2",
                    selectedFilter.country?.slug === item.slug &&
                      "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  )}
                >
                  {item.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <DrawerFooter>
            <Button>Apply</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="muted">
            <Filter />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="grid grid-cols-2 p-0" align="end">
          <div>
            <DropdownMenuLabel className="bg-muted text-center">
              Category
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup className="grid grid-cols-2 gap-1 p-2">
              {filter?.category.map((item) => (
                <DropdownMenuRadioItem
                  key={item._id}
                  value={item.name}
                  onSelect={(e) => {
                    e.preventDefault();
                    handleSelectFilter("category", item);
                  }}
                  className={cn(
                    "pl-2",
                    selectedFilter.category?.slug === item.slug &&
                      "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  )}
                >
                  {item.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </div>
          <div>
            <DropdownMenuLabel className="bg-muted text-center">
              Country
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup className="grid grid-cols-2 gap-1 border-l p-2">
              {filter?.country.map((item) => (
                <DropdownMenuRadioItem
                  key={item._id}
                  value={item.name}
                  onSelect={(e) => {
                    e.preventDefault();
                    handleSelectFilter("country", item);
                  }}
                  className={cn(
                    "pl-2",
                    selectedFilter.country?.slug === item.slug &&
                      "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  )}
                >
                  {item.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
