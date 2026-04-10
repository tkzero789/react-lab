import DashboardBreadcrumb from "../components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
import { pathClient } from "@/lib/path-client";
import TodoContent from "./components/todo-content";

export default function TodoPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          {
            title: "Apps",
            href: pathClient("/apps"),
          },
          {
            title: "Todo",
          },
        ]}
      />
      <DashboardContainer className="max-w-2xl">
        <TodoContent />
      </DashboardContainer>
    </>
  );
}
