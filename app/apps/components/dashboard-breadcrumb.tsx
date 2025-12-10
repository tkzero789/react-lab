import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

type BreadcrumbStep = {
  title: string;
  href?: string;
};

type Props = {
  breadcrumbs: BreadcrumbStep[];
};

export default function DashboardBreadcrumb({ breadcrumbs }: Props) {
  return (
    <header className="flex shrink-0 items-center gap-2 border-b p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item: BreadcrumbStep, index) => {
              if (index < breadcrumbs.length - 1) {
                return (
                  <React.Fragment key={item.title}>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={item.href}>
                        {item.title}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </React.Fragment>
                );
              } else {
                return (
                  <BreadcrumbItem key={item.title}>
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                );
              }
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
