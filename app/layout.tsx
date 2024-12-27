import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

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
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-gray-100 dark:bg-black">
              {children}
              <Toaster
                toastOptions={{
                  className: "flex gap-2 items-center",
                  classNames: {
                    error: "border-red-500 text-red-700",
                    success: "border-green-500 text-green-700",
                    info: "border-blue-500 text-blue-700",
                  },
                }}
              />
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
