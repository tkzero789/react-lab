"use client";

import GoogleIcon from "@/components/icons/google-icon";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { authClient } from "@/lib/auth-client";

type Props = {
  description: string;
};

export default function SignInPrompt({ description }: Props) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Sign in to get started</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <Button
        variant="outline"
        onClick={() =>
          authClient.signIn.social({
            provider: "google",
            callbackURL: window.location.href,
          })
        }
      >
        <GoogleIcon />
        Continue with Google
      </Button>
    </Empty>
  );
}
