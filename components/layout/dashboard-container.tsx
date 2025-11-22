import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function DashboardContainer({ children, className }: Props) {
  return (
    <div className="w-full bg-sidebar p-2">
      <div
        className={cn("h-full w-full rounded-xl bg-background p-6", className)}
      >
        {children}
      </div>
    </div>
  );
}
