/* Home page account button that opens the sign-in or account dialog */
"use client"

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import { LogOut } from "lucide-react"

import GoogleIcon from "@/components/icons/google-icon"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { useGoogleSignIn, useSignOut } from "@/hooks/use-auth-actions"
import { authClient } from "@/lib/auth-client"

export default function UserMenu() {
  return (
    <>
      <Unauthenticated>
        <SignInDialog />
      </Unauthenticated>
      <AuthLoading>
        <TriggerSkeleton />
      </AuthLoading>
      <Authenticated>
        <AccountDialog />
      </Authenticated>
    </>
  )
}

function TriggerSkeleton() {
  /* Match the outline button frame so the trigger does not shift when auth resolves */
  return (
    <div className="inline-flex h-12 items-center gap-1.5 rounded-lg border bg-background px-2.5">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="grid flex-1 gap-1">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

function SignInDialog() {
  const { isSigningIn, signIn } = useGoogleSignIn()

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" className="h-12">
            <GoogleIcon />
            Sign in with Google
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
        </DialogHeader>
        <DialogBody className="pb-4">
          <Button
            className="w-full"
            variant="outline"
            onClick={signIn}
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

function AccountDialog() {
  const { data: session } = authClient.useSession()
  const { isSigningOut, signOut } = useSignOut()

  const user = session?.user
  /* Convex can report Authenticated before the session query returns */
  if (!user) return <TriggerSkeleton />

  const initial = user.name.charAt(0).toUpperCase() || "?"

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" className="h-12">
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
          </Button>
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
          {/* Sign-out flips Convex to Unauthenticated, so this dialog unmounts and needs no close call */}
          <Button
            variant="outline"
            onClick={signOut}
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
