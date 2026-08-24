import React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import { Toaster } from "@/components/ui/toast"
import { ConvexClientProvider } from "@/app/convex-client-provider"
import "./css/globals.css"

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "600"] })

export const metadata: Metadata = {
  title: "React Lab",
  description: "Practice React",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} antialiased`}>
        <Toaster>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </Toaster>
      </body>
    </html>
  )
}
