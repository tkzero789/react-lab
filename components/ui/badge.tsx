import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-xs px-2.5 py-1 text-xs leading-none font-medium tracking-wide whitespace-nowrap transition-colors focus:ring-2 focus:ring-border focus:ring-offset-2 focus:outline-hidden",
  {
    variants: {
      variant: {
        default: "bg-brand text-brand-foreground",
        secondary: "bg-muted text-foreground",
        muted: "bg-muted text-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
