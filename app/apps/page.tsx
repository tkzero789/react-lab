import type { Metadata } from "next";
import DashboardBreadcrumb from "./components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { pathServer } from "@/lib/path-server";

export const metadata: Metadata = {
  title: "Apps",
};

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
];

export default async function AppsPage() {
  const resolvedApps = await Promise.all(
    apps.map(async (app) => ({ ...app, href: await pathServer(app.href) }))
  );

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
          <Button key={app.title} asChild variant="muted">
            <Link href={app.href}>{app.title}</Link>
          </Button>
        ))}
      </DashboardContainer>
    </>
  );
}
