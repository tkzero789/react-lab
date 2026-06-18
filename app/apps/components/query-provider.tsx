"use client";

import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { convex } from "@/app/convex-client-provider";

type Props = {
  children: React.ReactNode;
};

export default function QueryProvider({ children }: Props) {
  const [queryClient] = React.useState(() => {
    const convexQueryClient = new ConvexQueryClient(convex);
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          // Route Convex queries through the websocket client and key them
          // by function reference + args so the cache stays reactive.
          queryKeyHashFn: convexQueryClient.hashFn(),
          queryFn: convexQueryClient.queryFn(),
          refetchOnWindowFocus: false,
        },
      },
    });
    convexQueryClient.connect(client);
    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
