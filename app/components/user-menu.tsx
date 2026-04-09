"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/icons/google-icon";

type Props = {
  type?: "default" | "sidebar";
};

export default function UserMenu({ type = "default" }: Props) {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  function handleGoogleSignIn() {
    authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.href,
    });
  }

  async function handleSignOut() {
    await authClient.signOut();
    setOpen(false);
    router.refresh();
  }
  function renderDefaultTrigger() {
    return (
      <Button variant="outline" className="h-12">
        {session?.user ? (
          <>
            <Avatar className="size-8">
              <AvatarImage src={session.user.image ?? undefined} />
              <AvatarFallback className="rounded-full bg-sidebar-primary text-xs text-sidebar-primary-foreground">
                {session.user.name?.charAt(0)?.toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{session.user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {session.user.email}
              </span>
            </div>
          </>
        ) : (
          <>
            <GoogleIcon />
            Sign in with Google
          </>
        )}
      </Button>
    );
  }

  function renderSidebarTrigger() {
    return (
      <div className="flex flex-1 items-center gap-2 p-2">
        {session?.user ? (
          <>
            <Avatar className="size-8 rounded-full">
              <AvatarImage src={session.user.image ?? undefined} />
              <AvatarFallback className="rounded-full bg-sidebar-primary text-xs text-sidebar-primary-foreground">
                {session.user.name?.charAt(0)?.toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{session.user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {session.user.email}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex size-8 items-center justify-center rounded-full border bg-background shadow dark:bg-muted">
              <User className="size-4" />
            </div>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Sign in</span>
              <span className="truncate text-xs text-muted-foreground">
                to access your account
              </span>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "default" ? renderDefaultTrigger() : renderSidebarTrigger()}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        {session?.user ? (
          <>
            <DialogHeader>
              <DialogTitle>Account</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <div className="flex items-center gap-2">
                <Avatar className="size-12">
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback>
                    {session.user.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid text-sm">
                  <span className="font-medium">{session.user.name}</span>
                  <span className="text-muted-foreground">
                    {session.user.email}
                  </span>
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="w-full"
              >
                <LogOut />
                Sign out
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Sign in</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleGoogleSignIn}
              >
                <GoogleIcon />
                Continue with Google
              </Button>
            </DialogBody>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
