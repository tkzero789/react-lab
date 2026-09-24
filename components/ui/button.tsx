import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "pressable bg-brand text-brand-foreground hover:bg-button-default-hover",
        outline:
          "pressable border-border bg-background hover:bg-button-outline-hover hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        muted:
          "pressable bg-muted text-foreground hover:bg-button-muted-hover aria-expanded:bg-muted aria-expanded:text-foreground",
        ghost:
          "pressable hover:bg-button-ghost-hover hover:text-foreground active:bg-button-ghost-hover aria-expanded:bg-transparent aria-expanded:text-foreground",
        destructive:
          "pressable bg-destructive text-destructive-foreground hover:bg-button-destructive-hover",
        "ghost-destructive":
          "pressable text-destructive-foreground hover:bg-button-ghost-destructive-hover aria-expanded:bg-transparent aria-expanded:text-destructive-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        input:
          "justify-start gap-3! border-border bg-input px-3! font-normal hover:bg-button-input-hover [&_svg]:text-muted-foreground",
      },
      size: {
        default:
          "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-8 gap-1 px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
      },
      /* A pill inside a ButtonGroup uses the group radius, so the outer corners of the group match */
      shape: {
        default: "",
        pill: "rounded-full in-data-[slot=button-group]:rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  shape = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
