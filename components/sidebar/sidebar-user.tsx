/* Sidebar user menu with the appearance setting and the log in or log out action */
"use client"

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import {
  ChevronsUpDown,
  LogOut,
  Monitor,
  Moon,
  Sun,
  SunMoon,
  User,
} from "lucide-react"
import React from "react"

import GoogleIcon from "@/components/icons/google-icon"
import { useTheme } from "@/components/theme/theme-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { useGoogleSignIn, useSignOut } from "@/hooks/use-auth-actions"
import { authClient } from "@/lib/auth-client"

export function SidebarUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <AuthLoading>
          <UserSkeleton />
        </AuthLoading>
        <Unauthenticated>
          <GuestMenu />
        </Unauthenticated>
        <Authenticated>
          <AccountMenu />
        </Authenticated>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function UserSkeleton() {
  return (
    <div className="flex h-12 items-center gap-2 p-2">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="grid flex-1 gap-1">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

function GuestMenu() {
  const { isSigningIn, signIn } = useGoogleSignIn()

  return (
    <UserDropdown
      avatar={
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-background">
          <User className="size-4" />
        </div>
      }
      title="Guest"
      subtitle="Not logged in"
    >
      {/* Keep the menu open to show the spinner until the redirect */}
      <DropdownMenuItem
        closeOnClick={false}
        disabled={isSigningIn}
        onClick={signIn}
      >
        {isSigningIn ? <Spinner /> : <GoogleIcon />}
        Log in with Google
      </DropdownMenuItem>
    </UserDropdown>
  )
}

function AccountMenu() {
  const { data: session } = authClient.useSession()
  const { isSigningOut, signOut } = useSignOut()

  const user = session?.user
  /* Convex can report Authenticated before the session query returns */
  if (!user) return <UserSkeleton />

  return (
    <UserDropdown
      avatar={
        <Avatar className="size-8">
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback className="rounded-full bg-muted text-xs text-foreground">
            {user.name.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
      }
      title={user.name}
      subtitle={user.email}
    >
      {/* Keep the menu open to show the spinner. Sign-out unmounts this menu. */}
      <DropdownMenuItem
        closeOnClick={false}
        disabled={isSigningOut}
        onClick={signOut}
      >
        {isSigningOut ? <Spinner /> : <LogOut />}
        Log out
      </DropdownMenuItem>
    </UserDropdown>
  )
}

type UserDropdownProps = {
  avatar: React.ReactNode
  title: string
  subtitle: string
  children: React.ReactNode
}

function UserDropdown({ avatar, title, subtitle, children }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton
            size="lg"
            className="data-popup-open:bg-muted data-popup-open:text-foreground"
          />
        }
      >
        {avatar}
        <div className="grid flex-1 text-left leading-tight">
          <span className="truncate font-medium">{title}</span>
          <span className="truncate text-xs text-muted-foreground">
            {subtitle}
          </span>
        </div>
        <ChevronsUpDown className="ml-auto" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="min-w-56">
        <AppearanceMenu />
        <DropdownMenuSeparator />
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AppearanceMenu() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <SunMoon />
        Appearance
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">
            <Sun />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
