"use client"

/* Container that slides between the steps of a flow */

import React from "react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { cn } from "@/lib/utils"

export type Direction = 1 | -1

type Props = {
  stepKey: string
  direction: Direction
  fill?: boolean
  children: React.ReactNode
}

const EASE_OUT = [0.32, 0.72, 0, 1] as const

const slide: Variants = {
  enter: (direction: Direction) => ({ x: `${direction * 20}%`, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: Direction) => ({ x: `${direction * -20}%`, opacity: 0 }),
}

function useHeight<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [height, setHeight] = React.useState<number | "auto">("auto")

  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) =>
      setHeight(entry.borderBoxSize[0].blockSize)
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, height] as const
}

export default function StepTransition({
  stepKey,
  direction,
  fill = false,
  children,
}: Props) {
  const [ref, height] = useHeight<HTMLDivElement>()

  return (
    /* Use clip, not hidden. Hidden makes a scroll container and breaks sticky children. */
    <motion.div
      animate={fill ? undefined : { height }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
      className={cn("overflow-clip", fill && "h-full")}
    >
      <div ref={ref} className={cn("relative", fill && "h-full")}>
        {/* popLayout takes the old step out of the flow, so the height follows the new step */}
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={stepKey}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className={cn(
              fill &&
                "h-full scrollbar-thin overflow-y-auto overscroll-contain px-4"
            )}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
