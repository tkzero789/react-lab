"use client"

import Nextjs from "@/components/icons/nextjs-icon"
import Replicas from "@/components/icons/replicas-icon"
import Threejs from "@/components/icons/threejs-icon"
import { cn } from "@/lib/utils"
import Link from "next/link"
import React from "react"

const SUBDOMAIN_MAP: Record<string, string> = {
  Apps: "apps",
  Replicas: "replicas",
}

const cardItems = [
  {
    icon: Threejs,
    iconBackground: "bg-linear-to-b from-threejs-start to-threejs-end",
    title: "Three.js",
    href: "/threejs",
    hoverBackground: "hover:bg-threejs-hover active:bg-threejs-hover",
  },
  {
    icon: Replicas,
    iconBackground: "bg-linear-to-b from-replicas-start to-replicas-end",
    title: "Replicas",
    href: "/replicas",
    hoverBackground: "hover:bg-replicas-hover active:bg-replicas-hover",
  },
  {
    icon: Nextjs,
    iconBackground: "bg-linear-to-b from-apps-start to-apps-end",
    title: "Apps",
    href: "/apps",
    hoverBackground: "hover:bg-apps-hover active:bg-apps-hover",
  },
]

const ROOT_DOMAIN = "thinhtran.dev"

function getHref(title: string, fallbackHref: string, hostname: string) {
  const subdomain = SUBDOMAIN_MAP[title]
  if (!subdomain) return fallbackHref

  /* Only the production domain has subdomains. Other hosts, like tunnels and preview URLs, use path routing. */
  const isProductionHost =
    hostname === ROOT_DOMAIN || hostname.endsWith(`.${ROOT_DOMAIN}`)
  return isProductionHost
    ? `https://${subdomain}.${ROOT_DOMAIN}`
    : fallbackHref
}

export default function LabCards() {
  // Read the host on the client so this page can render statically (no
  // headers()). Until mounted, fall back to path-based hrefs, which resolve
  // on any host — subdomain routing is a progressive enhancement.
  const [host, setHost] = React.useState<string | null>(null)
  React.useEffect(() => {
    setHost(window.location.hostname)
  }, [])

  return (
    <div className="grid place-items-center gap-8 md:grid-cols-3">
      {cardItems.map((item) => (
        <Link
          href={host ? getHref(item.title, item.href, host) : item.href}
          key={item.title}
          className={cn(
            "group size-30 pressable rounded-lg bg-muted p-2 transition-all duration-300 lg:size-48",
            item.hoverBackground
          )}
        >
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg bg-background">
            <div
              className={`flex size-10 items-center justify-center rounded-lg p-2 transition-all duration-300 group-hover:scale-105 lg:size-14 ${item.iconBackground}`}
            >
              <item.icon />
            </div>
            <div className="flex items-center justify-center text-sm font-medium lg:text-base">
              {item.title}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
