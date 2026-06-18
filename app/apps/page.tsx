import type { Metadata } from "next"
import DashboardBreadcrumb from "./components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { buttonVariants } from "@/components/ui/button"
import { pathServer } from "@/lib/path-server"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Apps",
}

const apps = [
  {
    title: "Todo",
    href: "/apps/todo",
  },
  {
    title: "Weather",
    href: "/apps/weather",
  },
  {
    title: "Movie",
    href: "/apps/movie",
  },
  {
    title: "Grocery",
    href: "/apps/grocery",
  },
  {
    title: "Workout",
    href: "/apps/workout",
  },
]

export default async function AppsPage() {
  const resolvedApps = await Promise.all(
    apps.map(async (app) => ({ ...app, href: await pathServer(app.href) }))
  )

  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          {
            title: "Apps",
          },
        ]}
      />
      <DashboardContainer className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {resolvedApps.map((app) => (
          <a
            key={app.title}
            href={app.href}
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            {app.title}
          </a>
        ))}
      </DashboardContainer>
    </>
  )
}
