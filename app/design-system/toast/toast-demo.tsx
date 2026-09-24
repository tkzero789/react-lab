"use client"

/* Buttons that raise a toast, because toast() runs on an event */
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function ToastTypes() {
  return (
    <>
      <Button
        variant="outline"
        onClick={() => toast.add({ title: "The build is queued" })}
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({ type: "success", title: "Deployed to production" })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({ type: "error", title: "The build failed" })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({ type: "warning", title: "The plan is near its quota" })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.add({ type: "info", title: "A new version is out" })}
      >
        Info
      </Button>
    </>
  )
}

export function ToastDescription() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.add({
          type: "success",
          title: "Domain added",
          description: "It can take up to 24 hours for DNS to update.",
        })
      }
    >
      With description
    </Button>
  )
}

export function ToastAction() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.add({
          title: "Deployment deleted",
          actionProps: {
            children: "Undo",
            onClick: () => toast.add({ type: "success", title: "Restored" }),
          },
        })
      }
    >
      With action
    </Button>
  )
}

export function ToastPromise() {
  return (
    <Button
      variant="outline"
      onClick={() => {
        const id = toast.add({ type: "loading", title: "Deploying" })
        setTimeout(
          () =>
            toast.update(id, {
              type: "success",
              title: "Deployed",
              description: "Build 421 is live.",
            }),
          1500
        )
      }}
    >
      Loading then success
    </Button>
  )
}
