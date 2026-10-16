"use client"

/* Search button and command palette that open any design system page */

import * as React from "react"
import { useRouter } from "next/navigation"
import { Component, Palette, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { pathClient } from "@/lib/path-client"

import { uiComponents } from "../registry"

const components = uiComponents.filter((component) => component.documented)

function subscribe() {
  return () => {}
}

/* The server cannot know the platform. It renders Ctrl, and the client swaps in ⌘ after hydration. */
function useIsMac() {
  return React.useSyncExternalStore(
    subscribe,
    () => /Mac|iPhone|iPad/.test(navigator.userAgent),
    () => false
  )
}

export default function DocsSearch() {
  const router = useRouter()
  const isMac = useIsMac()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  function go(url: string) {
    setOpen(false)
    router.push(pathClient(url))
  }

  return (
    <>
      <Button
        variant="input"
        aria-label="Search"
        onClick={() => setOpen(true)}
        className="sm:w-64"
      >
        <Search />
        <span className="hidden flex-1 text-left text-muted-foreground sm:inline">
          Search
        </span>
        <KbdGroup className="hidden sm:inline-flex">
          <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search the design system"
        description="Find the design tokens or a component."
      >
        <Command>
          <CommandInput placeholder="Search components" />
          <CommandList>
            <CommandEmpty>No result.</CommandEmpty>
            <CommandGroup heading="Foundations">
              <CommandItem onSelect={() => go("/design-system/tokens")}>
                <Palette />
                Design Tokens
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Components">
              {components.map((component) => (
                <CommandItem
                  key={component.slug}
                  onSelect={() => go(`/design-system/${component.slug}`)}
                >
                  <Component />
                  {component.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
