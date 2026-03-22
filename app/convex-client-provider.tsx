"use client";

import { ReactNode, useEffect, useRef } from "react";
import { ConvexReactClient, useMutation } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { api } from "@/convex/_generated/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function EnsureUser() {
  const { data: session } = authClient.useSession();
  const ensureUser = useMutation(api.users.ensureUser);
  const hasEnsured = useRef(false);

  useEffect(() => {
    if (session?.user && !hasEnsured.current) {
      hasEnsured.current = true;
      ensureUser().catch(console.error);
    }
    if (!session?.user) {
      hasEnsured.current = false;
    }
  }, [session?.user, ensureUser]);

  return null;
}

export function ConvexClientProvider({
  children,
  initialToken,
}: {
  children: ReactNode;
  initialToken?: string | null;
}) {
  return (
    <ConvexBetterAuthProvider
      client={convex}
      authClient={authClient}
      initialToken={initialToken}
    >
      <EnsureUser />
      {children}
    </ConvexBetterAuthProvider>
  );
}
