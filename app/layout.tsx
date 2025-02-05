import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import React from "react";
import SideBar from "@/components/sidebar/SideBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "React Lab",
  description: "Practice React",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SideBar>{children}</SideBar>
          <Toaster
            toastOptions={{
              className: "flex gap-2 items-center dark:bg-background",
              classNames: {
                error:
                  "border-red-500 text-red-700 dark:border-border dark:text-red-500",
                success:
                  "border-green-500 text-green-700 dark:border-border dark:text-green-500",
                info: "border-blue-500 text-blue-700 dark:border-border dark:text-blue-500",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
