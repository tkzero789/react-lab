import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { toast as manager } from "@/components/ui/toast"

/**
 * Intent-named wrappers over the Base UI toast manager, which only exposes a
 * generic `add({ type })`. Lives outside `components/ui/toast.tsx` so the
 * registry component stays pristine and re-addable via the shadcn CLI.
 *
 * `type` drives the icon and styling in `ToastList`.
 */
export type ToastOptions = {
  description?: ReactNode
  /** Milliseconds before auto-dismiss. `0` keeps it open until closed. */
  timeout?: number
  /** `high` announces urgently to screen readers. */
  priority?: "low" | "high"
  actionProps?: ComponentPropsWithoutRef<"button">
  onClose?: () => void
}

function emit(
  type: string | undefined,
  title: ReactNode,
  options?: ToastOptions
) {
  return manager.add({ title, type, ...options })
}

export const toast = Object.assign(
  (title: ReactNode, options?: ToastOptions) => emit(undefined, title, options),
  {
    success: (title: ReactNode, options?: ToastOptions) =>
      emit("success", title, options),
    error: (title: ReactNode, options?: ToastOptions) =>
      emit("error", title, options),
    info: (title: ReactNode, options?: ToastOptions) =>
      emit("info", title, options),
    warning: (title: ReactNode, options?: ToastOptions) =>
      emit("warning", title, options),
    // Spinners shouldn't time out on their own — close or update them by id.
    loading: (title: ReactNode, options?: ToastOptions) =>
      emit("loading", title, { timeout: 0, ...options }),
    dismiss: (id?: string) => manager.close(id),
    update: manager.update,
    promise: manager.promise,
  }
)
