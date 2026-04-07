import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import QueryProvider from "../components/query-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <QueryProvider>{children}</QueryProvider>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
