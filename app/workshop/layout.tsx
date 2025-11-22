import DashboardContainer from "@/components/layout/dashboard-container";
import SideBar from "@/components/sidebar/SideBar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <SideBar>
        <DashboardContainer>{children}</DashboardContainer>
      </SideBar>
    </ThemeProvider>
  );
}
