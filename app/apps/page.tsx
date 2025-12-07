import type { Metadata } from "next";
import DashboardBreadcrumb from "./components/dashboard-breadcrumb";

export const metadata: Metadata = {
  title: "Apps",
};

export default function AppsPage() {
  return (
    <DashboardBreadcrumb
      breadcrumbs={[
        {
          title: "Apps",
        },
      ]}
    />
  );
}
