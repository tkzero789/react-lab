import SideBar from "@/components/sidebar/SideBar";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <SideBar>{children}</SideBar>
    </ThemeProvider>
  );
}
