"use client";

import { authClient } from "@/lib/auth-client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  type?: "default" | "sidebar";
};

export default function UserMenu({ type = "default" }: Props) {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = React.useState(false);

  function handleGoogleSignIn() {
    authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  }

  function handleSignOut() {
    authClient.signOut();
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "default" ? (
          <Button variant="ghost">
            {session?.user ? (
              <>
                <Avatar className="size-8 rounded-xl">
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback className="rounded-xl bg-sidebar-primary text-xs text-sidebar-primary-foreground">
                    {session.user.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {session.user.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {session.user.email}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                  <LogIn className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Sign in</span>
                  <span className="truncate text-xs text-muted-foreground">
                    to access your account
                  </span>
                </div>
              </>
            )}
          </Button>
        ) : (
          <div className="flex flex-1 items-center gap-2 p-2">
            {session?.user ? (
              <>
                <Avatar className="size-8 rounded-xl">
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback className="rounded-xl bg-sidebar-primary text-xs text-sidebar-primary-foreground">
                    {session.user.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {session.user.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {session.user.email}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                  <LogIn className="size-4" />
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
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        {session?.user ? (
          <>
            <DialogHeader>
              <DialogTitle>Account</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-3 py-4">
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
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 size-4" />
              Sign out
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Sign in</DialogTitle>
            </DialogHeader>
            <Button
              className="w-full"
              variant="outline"
              onClick={handleGoogleSignIn}
            >
              <svg className="mr-2 size-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
