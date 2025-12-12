import React from "react";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./css/globals.css";

const roboto = Roboto({ subsets: ["latin"], weight: "400" });

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
      <body className={`${roboto.className} antialiased`}>
        {children}
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
      </body>
    </html>
  );
}
