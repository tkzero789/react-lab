"use client"

/* On this page list with a line that follows the section in view */

import React from "react"
import { usePathname } from "next/navigation"
import { MotionConfig, motion } from "motion/react"

import { cn } from "@/lib/utils"

type Section = {
  id: string
  title: string
}

/* Sections use scroll-mt-20, so a section is current once its top passes this line */
const ACTIVE_OFFSET = 96

const EASE_OUT = [0.32, 0.72, 0, 1] as const

export default function OnThisPage() {
  const pathname = usePathname()
  const [sections, setSections] = React.useState<Section[]>([])
  const [activeId, setActiveId] = React.useState<string>()

  /* The pages are server components, so read the sections from the DOM after each navigation */
  React.useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-slot="example"]')
    )
    setSections(
      elements.map((element) => ({
        id: element.id,
        title: element.dataset.title ?? element.id,
      }))
    )

    let frame = 0

    function update() {
      frame = 0
      /* The last sections can be too short to reach the line, so the page bottom selects the last one */
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1
      const passed = elements.filter(
        (element) => element.getBoundingClientRect().top <= ACTIVE_OFFSET
      )
      const active = atBottom ? elements.at(-1) : (passed.at(-1) ?? elements[0])
      setActiveId(active?.id)
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    schedule()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [pathname])

  if (sections.length === 0) return null

  return (
    <aside className="hidden xl:col-start-2 xl:row-start-3 xl:block">
      <nav
        aria-label="On this page"
        className="sticky top-14 flex flex-col gap-3 py-8 pr-4"
      >
        <p className="text-sm font-medium">On this page</p>
        <MotionConfig reducedMotion="user">
          <ul className="relative flex flex-col">
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-muted"
            />
            {sections.map((section) => {
              const isActive = section.id === activeId
              return (
                <li key={section.id} className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="on-this-page-line"
                      aria-hidden
                      transition={{ duration: 0.3, ease: EASE_OUT }}
                      className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-foreground"
                    />
                  )}
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "block origin-left pressable py-1 pl-4 text-sm text-muted-foreground hover:text-foreground active:text-foreground",
                      isActive && "text-foreground"
                    )}
                  >
                    {section.title}
                  </a>
                </li>
              )
            })}
          </ul>
        </MotionConfig>
      </nav>
    </aside>
  )
}
