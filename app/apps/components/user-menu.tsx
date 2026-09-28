"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import React from "react"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import GoogleIcon from "@/components/icons/google-icon"

type TriggerType = "default" | "sidebar"

type Props = {
  type?: TriggerType
}

export default function UserMenu({ type = "default" }: Props) {
  return (
    <>
      <Unauthenticated>
        <SignInDialog type={type} />
      </Unauthenticated>
      <AuthLoading>
        <TriggerSkeleton type={type} />
      </AuthLoading>
      <Authenticated>
        <AccountDialog type={type} />
      </Authenticated>
    </>
  )
}

function TriggerSkeleton({ type }: { type: TriggerType }) {
  if (type === "default") return <Skeleton className="h-12 w-56" />

  return (
    <div className="flex flex-1 items-center gap-2 p-2">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="grid flex-1 gap-1">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

function SignInDialog({ type }: { type: TriggerType }) {
  const [isSigningIn, setIsSigningIn] = React.useState(false)

  React.useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) setIsSigningIn(false)
    }
    window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [])

  async function handleGoogleSignIn() {
    setIsSigningIn(true)
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.href,
    })

    if (error) setIsSigningIn(false)
  }

  return (
    <Dialog>
      <DialogTrigger
        nativeButton={type === "default"}
        render={
          type === "default" ? (
            <Button variant="outline" className="h-12">
              <GoogleIcon />
              Sign in with Google
            </Button>
          ) : (
            <div className="flex flex-1 items-center gap-2 p-2">
              <div className="flex size-8 items-center justify-center rounded-full border bg-background shadow-sm dark:bg-muted">
                <User className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Sign in</span>
                <span className="truncate text-xs text-muted-foreground">
                  to access your account
                </span>
              </div>
            </div>
          )
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Button
            className="w-full"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
          >
            {isSigningIn ? <Spinner /> : <GoogleIcon />}
            Continue with Google
          </Button>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

function AccountDialog({ type }: { type: TriggerType }) {
  const { data: session } = authClient.useSession()
  const [isSigningOut, startSignOut] = React.useTransition()
  const router = useRouter()

  function handleSignOut() {
    /* Sign-out flips Convex to Unauthenticated, so this dialog unmounts and needs no close call */
    startSignOut(async () => {
      await authClient.signOut()
      router.refresh()
    })
  }

  const user = session?.user
  if (!user) return null

  const initial = user.name.charAt(0).toUpperCase() || "?"
  const summary = (
    <>
      <Avatar className="size-8">
        <AvatarImage src={user.image ?? undefined} />
        <AvatarFallback className="rounded-full bg-muted text-xs text-foreground">
          {initial}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{user.name}</span>
        <span className="truncate text-xs text-muted-foreground">
          {user.email}
        </span>
      </div>
    </>
  )

  return (
    <Dialog>
      <DialogTrigger
        nativeButton={type === "default"}
        render={
          type === "default" ? (
            <Button variant="outline" className="h-12">
              {summary}
            </Button>
          ) : (
            <div className="flex flex-1 items-center gap-2 p-2">{summary}</div>
          )
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex items-center gap-2">
            <Avatar className="size-12">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
            <div className="grid text-sm">
              <span className="font-medium">{user.name}</span>
              <span className="text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full"
          >
            {isSigningOut ? <Spinner /> : <LogOut />}
            Sign out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
