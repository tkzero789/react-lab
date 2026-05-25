import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const buttonGroupVariants = cva(
  "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 focus-visible:*:relative focus-visible:*:z-10 [&>[data-slot=select-trigger]:last-of-type]:has-[select[aria-hidden=true]:last-child]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 rounded-xl overflow-hidden",
  {
    variants: {
      orientation: {
        horizontal: cn(
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>*:has(+:hover)]:border-r-primary [&>*:has(+:hover)]:relative",
          `
          [&>*:has(+:hover)]:before:absolute 
          [&>*:has(+:hover)]:before:-top-px 
          [&>*:has(+:hover)]:before:-right-px 
          [&>*:has(+:hover)]:before:size-px
          [&>*:has(+:hover)]:before:bg-primary
          `,
          `
          [&>*:has(+:hover)]:after:absolute 
          [&>*:has(+:hover)]:after:-bottom-px 
          [&>*:has(+:hover)]:after:-right-px 
          [&>*:has(+:hover)]:after:size-px
          [&>*:has(+:hover)]:after:bg-primary
          `,
        ),
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>*:has(+:hover)]:border-b [&>*:hover+*]:border-t",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

const buttonGroupSeparatorVariants = cva("", {
  variants: {
    variant: {
      primary: "bg-primary",
      secondary: "bg-secondary",
      muted: "bg-muted",
      border: "bg-border",
    },
  },
  defaultVariants: {
    variant: "border",
  },
});

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={cn(
        "shadow-2xs flex items-center gap-2 rounded-md border bg-muted px-4 text-sm font-medium [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  variant,
  ...props
}: React.ComponentProps<typeof Separator> &
  VariantProps<typeof buttonGroupSeparatorVariants>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        buttonGroupSeparatorVariants({ variant }),
        "relative m-0! self-stretch data-[orientation=vertical]:h-auto",
        className,
      )}
      {...props}
    />
  );
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
};
