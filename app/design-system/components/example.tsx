/* Preview frame and titled example section for component docs */
import React from "react"

import { cn } from "@/lib/utils"

type PreviewProps = {
  children: React.ReactNode
  className?: string
}

export function Preview({ children, className }: PreviewProps) {
  return (
    <div
      className={cn(
        "flex min-h-40 flex-wrap items-center justify-center gap-4 rounded-lg border p-6",
        className
      )}
    >
      {children}
    </div>
  )
}

type DescriptionProps = {
  children: React.ReactNode
  className?: string
}

export function Description({ children, className }: DescriptionProps) {
  return (
    <p
      className={cn(
        "text-sm leading-relaxed text-muted-foreground [&_code]:rounded-xs [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-foreground",
        className
      )}
    >
      {children}
    </p>
  )
}

type ExampleProps = {
  title: string
  description: React.ReactNode
  children: React.ReactNode
}

export function Example({ title, description, children }: ExampleProps) {
  const id = title.toLowerCase().replaceAll(" ", "-")

  return (
    <section id={id} className="flex scroll-mt-20 flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <Description>{description}</Description>
      </div>
      <Preview>{children}</Preview>
    </section>
  )
}
