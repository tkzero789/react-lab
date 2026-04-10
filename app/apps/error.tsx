"use client";

import DashboardContainer from "@/components/layout/dashboard-container";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <DashboardContainer className="flex h-dvh flex-col items-center justify-center gap-2">
      <h2>Something went wrong!</h2>
      <Button onClick={() => unstable_retry()}>Try again</Button>
    </DashboardContainer>
  );
}
