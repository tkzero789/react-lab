import type { Metadata } from "next";
import DashboardBreadcrumb from "./components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
];

export default function AppsPage() {
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
        {apps.map((app) => (
          <Button key={app.title} asChild variant="muted">
            <Link href={app.href}>{app.title}</Link>
          </Button>
        ))}
      </DashboardContainer>
    </>
  );
}
