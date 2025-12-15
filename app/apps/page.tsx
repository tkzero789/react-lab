import type { Metadata } from "next";
import DashboardBreadcrumb from "./components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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
      <DashboardContainer className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {apps.map((app) => (
          <Link key={app.title} href={app.href} className="group">
            <Card className="transition-all group-hover:bg-muted">
              <CardHeader className="pb-4">
                <CardTitle>{app.title}</CardTitle>
              </CardHeader>
              {/* <CardContent> */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* <img
                  src="https://miro.medium.com/max/2000/1*TEjMGT3zZKz2MaAZBZkXhw.png"
                  alt="app image"
                  width={200}
                  height={100}
                  className="h-36 w-full rounded-xl"
                /> */}
              {/* </CardContent> */}
            </Card>
          </Link>
        ))}
      </DashboardContainer>
    </>
  );
}
