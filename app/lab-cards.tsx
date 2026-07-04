"use client"

import Nextjs from "@/components/icons/nextjs-icon"
import Replicas from "@/components/icons/replicas-icon"
import Threejs from "@/components/icons/threejs-icon"
import Link from "next/link"
import React from "react"

const SUBDOMAIN_MAP: Record<string, string> = {
  Apps: "apps",
  Replicas: "replicas",
}

const cardItems = [
  {
    icon: Threejs,
    iconBackground: "bg-linear-to-b from-yellow-300/70  to-yellow-600/80",
    title: "Three.js",
    href: "/threejs",
    hoverBackground: "hover:bg-yellow-400/40",
  },
  {
    icon: Replicas,
    iconBackground: "bg-linear-to-b from-green-300/70 to-green-500",
    title: "Replicas",
    href: "/replicas",
    hoverBackground: "hover:bg-green-400/40",
  },
  {
    icon: Nextjs,
    iconBackground: "bg-linear-to-b from-slate-400/50 to-slate-700/90",
    title: "Apps",
    href: "/apps",
    hoverBackground: "hover:bg-slate-400/40",
  },
]

function getHref(title: string, fallbackHref: string, host: string) {
  const subdomain = SUBDOMAIN_MAP[title]
  if (!subdomain) return fallbackHref

  // Use path-based routing for localhost and LAN/private-network IPs
  const hostname = host.split(":")[0]
  const isLocalhost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    /^192\.168\./.test(hostname) ||
    /^10\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
  if (isLocalhost) {
    return `/${subdomain}`
  }

  // Use subdomain routing in production
  // e.g. lab.thinhtran.dev → apps.thinhtran.dev
  const parts = host.replace(/^www\./, "").split(".")
  const rootDomain = parts.slice(-2).join(".")
  return `https://${subdomain}.${rootDomain}`
}

export default function LabCards() {
  // Read the host on the client so this page can render statically (no
  // headers()). Until mounted, fall back to path-based hrefs, which resolve
  // on any host — subdomain routing is a progressive enhancement.
  const [host, setHost] = React.useState<string | null>(null)
  React.useEffect(() => {
    setHost(window.location.host)
  }, [])

  return (
    <div className="grid place-items-center gap-8 md:grid-cols-3">
      {cardItems.map((item) => (
        <Link
          href={host ? getHref(item.title, item.href, host) : item.href}
          key={item.title}
          className={`group size-40 rounded-xl bg-muted p-2 transition-all duration-300 lg:size-48 ${item.hoverBackground}`}
        >
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl bg-background">
            <div
              className={`flex size-14 items-center justify-center rounded-xl p-2 transition-all duration-300 group-hover:scale-105 ${item.iconBackground}`}
            >
              <item.icon />
            </div>
            <div className="flex items-center justify-center font-medium">
              {item.title}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}