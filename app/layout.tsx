import React from "react"
import type { Metadata } from "next"
import { Noto_Color_Emoji, Roboto } from "next/font/google"
import { Toaster } from "@/components/ui/toast"
import { ConvexClientProvider } from "@/app/convex-client-provider"
import "./css/globals.css"

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "600"] })

/* The font is large. The browser downloads only the parts for the emoji on the page, so do not preload it. */
const notoEmoji = Noto_Color_Emoji({
  subsets: ["emoji"],
  weight: "400",
  variable: "--font-noto-emoji",
  preload: false,
})

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
      <body
        className={`${roboto.className} ${notoEmoji.variable} antialiased`}
        suppressHydrationWarning
      >
        <Toaster>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </Toaster>
      </body>
    </html>
  )
}
