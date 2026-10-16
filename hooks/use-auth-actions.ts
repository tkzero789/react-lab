/* Google sign-in and sign-out actions with their pending state */
"use client"

import { useRouter } from "next/navigation"
import React from "react"

import { authClient } from "@/lib/auth-client"

export function useGoogleSignIn() {
  const [isSigningIn, setIsSigningIn] = React.useState(false)

  /* The back button can restore this page from the bfcache with the pending state still on */
  React.useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) setIsSigningIn(false)
    }
    window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [])

  async function signIn() {
    setIsSigningIn(true)
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.href,
    })

    if (error) setIsSigningIn(false)
  }

  return { isSigningIn, signIn }
}

export function useSignOut() {
  const [isSigningOut, startSignOut] = React.useTransition()
  const router = useRouter()

  function signOut() {
    startSignOut(async () => {
      await authClient.signOut()
      router.refresh()
    })
  }

  return { isSigningOut, signOut }
}
