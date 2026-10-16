/* Sidebar links to each app */
"use client"

import {
  CloudSun,
  Dumbbell,
  Film,
  ListChecks,
  ShoppingBasket,
  Wallet,
} from "lucide-react"

import { NavGroup, type NavItem } from "@/components/sidebar/nav-group"

/* Icons are functions, so the list must live in a client module to reach NavGroup */
const apps: NavItem[] = [
  { name: "Todo", url: "/apps/todo", icon: ListChecks },
  { name: "Weather", url: "/apps/weather", icon: CloudSun },
  { name: "Movie", url: "/apps/movie", icon: Film },
  { name: "Grocery", url: "/apps/grocery", icon: ShoppingBasket },
  { name: "Workout", url: "/apps/workout", icon: Dumbbell },
  { name: "Finance", url: "/apps/finance", icon: Wallet },
]

export default function AppsNav() {
  return <NavGroup label="Apps" items={apps} />
}
