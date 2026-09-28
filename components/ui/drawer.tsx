"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type SnapPoint = DrawerPrimitive.Root.SnapPoint

/* Keep this at module scope so the array reference stays stable between renders */
const DEFAULT_SNAP_POINTS: SnapPoint[] = [0.95]

/* Base UI reads numbers up to 1 as a viewport fraction and larger numbers as pixels */
function toCssLength(snapPoint: SnapPoint) {
  if (typeof snapPoint === "string") return snapPoint
  return snapPoint <= 1 ? `${snapPoint * 100}dvh` : `${snapPoint}px`
}

type DrawerContextProps = {
  hasSnapPoints: boolean
  snapHeight: string | undefined
  modal: DrawerPrimitive.Root.Props["modal"]
  swipeDirection: NonNullable<DrawerPrimitive.Root.Props["swipeDirection"]>
}

const DrawerContext = React.createContext<DrawerContextProps | null>(null)

function useDrawer() {
  const context = React.useContext(DrawerContext)

  if (!context) {
    throw new Error("useDrawer must be used within a Drawer.")
  }

  return context
}

function Drawer({
  modal = true,
  fitContent = false,
  snapPoints,
  swipeDirection = "down",
  ...props
}: DrawerPrimitive.Root.Props & {
  /* Without snap points the popup height follows its content */
  fitContent?: boolean
}) {
  const isVertical = swipeDirection === "down" || swipeDirection === "up"
  const resolvedSnapPoints =
    snapPoints ?? (isVertical && !fitContent ? DEFAULT_SNAP_POINTS : undefined)
  const topSnapPoint = resolvedSnapPoints?.at(-1)
  const hasSnapPoints = topSnapPoint !== undefined
  const snapHeight =
    topSnapPoint === undefined ? undefined : toCssLength(topSnapPoint)
  const contextValue = React.useMemo(
    () => ({
      hasSnapPoints,
      snapHeight,
      modal,
      swipeDirection,
    }),
    [hasSnapPoints, snapHeight, modal, swipeDirection]
  )

  return (
    <DrawerContext.Provider value={contextValue}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        modal={modal}
        snapPoints={resolvedSnapPoints}
        swipeDirection={swipeDirection}
        {...props}
      />
    </DrawerContext.Provider>
  )
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 min-h-dvh bg-overlay opacity-[max(var(--drawer-overlay-min-opacity,0),calc(1-var(--drawer-swipe-progress)))] transition-opacity duration-150 select-none data-ending-style:pointer-events-none data-ending-style:opacity-0 data-snap-points:[--drawer-overlay-min-opacity:0.5] data-starting-style:opacity-0 data-swiping:duration-0",
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DrawerPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  const { hasSnapPoints, snapHeight, modal, swipeDirection } = useDrawer()
  const swipeAxis =
    swipeDirection === "down" || swipeDirection === "up" ? "y" : "x"

  /* The provider keeps a focused input above the iOS software keyboard */
  return (
    <DrawerPrimitive.VirtualKeyboardProvider>
      <DrawerPortal data-slot="drawer-portal">
        {/* Base UI skips the backdrop of a nested drawer unless forceRender is set */}
        {modal === true && (
          <DrawerOverlay
            forceRender
            data-snap-points={hasSnapPoints ? "" : undefined}
          />
        )}
        <DrawerPrimitive.Viewport
          data-slot="drawer-viewport"
          data-modal={modal}
          className="pointer-events-none fixed inset-0 z-50 select-none data-[modal=true]:pointer-events-auto"
        >
          <DrawerPrimitive.Popup
            data-slot="drawer-popup"
            data-swipe-axis={swipeAxis}
            data-snap-points={hasSnapPoints ? "" : undefined}
            style={
              snapHeight
                ? ({
                    "--drawer-snap-height": snapHeight,
                  } as React.CSSProperties)
                : undefined
            }
            className={cn(
              "group/drawer-popup pointer-events-auto fixed z-50 m-(--drawer-inset,0px) flex h-(--drawer-content-height) max-h-(--drawer-content-max-height,none) min-h-0 w-(--drawer-content-width,auto) transform-[translate3d(var(--translate-x,0px),var(--translate-y,0px),0)] flex-col bg-popover text-sm text-popover-foreground transition-[transform,height,opacity] duration-200 ease-in-out will-change-transform outline-none select-none [interpolate-size:allow-keywords] data-[swipe-direction=down]:rounded-t-lg data-[swipe-direction=down]:border-t data-[swipe-direction=left]:rounded-r-lg data-[swipe-direction=left]:border-r data-[swipe-direction=right]:rounded-l-lg data-[swipe-direction=right]:border-l data-[swipe-direction=up]:rounded-b-lg data-[swipe-direction=up]:border-b",
              "after:pointer-events-none after:absolute after:bg-(--drawer-bleed-background,var(--color-popover)) data-[swipe-axis=x]:after:inset-y-0 data-[swipe-axis=x]:after:w-(--bleed) data-[swipe-axis=y]:after:inset-x-0 data-[swipe-axis=y]:after:h-(--bleed) data-[swipe-direction=down]:after:top-full data-[swipe-direction=left]:after:right-full data-[swipe-direction=right]:after:left-full data-[swipe-direction=up]:after:bottom-full",
              "[--drawer-content-height:var(--drawer-height,auto)] data-[swipe-axis=x]:[--drawer-content-width:75%] data-[swipe-axis=y]:[--drawer-content-max-height:90dvh] data-[swipe-axis=y]:data-snap-points:[--drawer-content-height:var(--drawer-snap-height,100dvh)] data-[swipe-axis=y]:data-snap-points:[--drawer-content-max-height:none] data-[swipe-axis=x]:sm:[--drawer-content-width:24rem]",
              "[--bleed:3rem]",
              "data-ending-style:opacity-0 data-ending-style:[--slide-offset:2.5rem] data-starting-style:opacity-0 data-starting-style:[--slide-offset:2.5rem] data-swiping:duration-0 data-ending-style:data-swiping:duration-200",
              "data-[swipe-axis=y]:inset-x-0",
              "data-[swipe-axis=x]:inset-y-0 data-[swipe-axis=x]:flex-row",
              "data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)+var(--slide-offset,0px))]",
              "data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)-var(--slide-offset,0px))]",
              "data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:[--translate-x:calc(var(--drawer-swipe-movement-x)-var(--slide-offset,0px))]",
              "data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:[--translate-x:calc(var(--drawer-swipe-movement-x)+var(--slide-offset,0px))]",
              className
            )}
            {...props}
          >
            <DrawerPrimitive.Content
              data-slot="drawer-content"
              className={cn(
                "flex min-h-0 flex-1 flex-col overflow-hidden overscroll-contain rounded-[inherit] select-text group-data-swiping/drawer-popup:select-none group-data-[swipe-direction=down]/drawer-popup:pb-[env(safe-area-inset-bottom)]"
              )}
            >
              {children}
              {showCloseButton && (
                <DrawerPrimitive.Close
                  data-slot="drawer-close"
                  render={
                    <Button
                      variant="ghost"
                      className="absolute top-2 right-2"
                      size="icon-sm"
                    >
                      <XIcon />
                      <span className="sr-only">Close</span>
                    </Button>
                  }
                />
              )}
            </DrawerPrimitive.Content>
          </DrawerPrimitive.Popup>
        </DrawerPrimitive.Viewport>
      </DrawerPortal>
    </DrawerPrimitive.VirtualKeyboardProvider>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex shrink-0 flex-col gap-0.5 border-b p-4", className)}
      {...props}
    />
  )
}

/* Keyboard handling needs the header and footer outside the scroll area */
function DrawerBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-body"
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain p-4",
        className
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex shrink-0 flex-col gap-2 border-t p-4",
        className
      )}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "text-base leading-none font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-balance text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
