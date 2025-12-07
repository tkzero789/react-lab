import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function DashboardContainer({ children, className }: Props) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl p-4", className)}>
      {children}
    </div>
  );
}
