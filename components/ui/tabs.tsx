"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    wrapperClassName?: string;
  }
>(({ className, wrapperClassName, ...props }, ref) => {
  const [indicatorStyle, setIndicatorStyle] = React.useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const [ready, setReady] = React.useState(false);

  const tabsListRef = React.useRef<HTMLDivElement | null>(null);

  const updateIndicator = React.useCallback(() => {
    if (!tabsListRef.current) return;

    const activeTab = tabsListRef.current.querySelector<HTMLElement>(
      '[data-state="active"]',
    );
    if (!activeTab) return;

    const activeRect = activeTab.getBoundingClientRect();
    const tabsRect = tabsListRef.current.getBoundingClientRect();

    requestAnimationFrame(() => {
      setIndicatorStyle({
        left: activeRect.left - tabsRect.left,
        top: activeRect.top - tabsRect.top,
        width: activeRect.width,
        height: activeRect.height,
      });
      requestAnimationFrame(() => setReady(true));
    });
  }, []);

  React.useEffect(() => {
    // Initial update
    const timeoutId = setTimeout(updateIndicator, 0);

    // Event listeners
    window.addEventListener("resize", updateIndicator);
    const observer = new MutationObserver(updateIndicator);

    if (tabsListRef.current) {
      observer.observe(tabsListRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateIndicator);
      observer.disconnect();
    };
  }, [updateIndicator]);

  return (
    <div className={cn("relative", wrapperClassName)} ref={tabsListRef}>
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          "relative inline-flex h-10 items-center justify-center rounded-xl bg-muted p-1",
          className,
        )}
        {...props}
      />
      <div
        className={cn(
          "absolute rounded-xl border border-transparent bg-background shadow-sm",
          ready && "transition-all duration-300 ease-in-out",
        )}
        style={indicatorStyle}
      />
    </div>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "z-10 inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
