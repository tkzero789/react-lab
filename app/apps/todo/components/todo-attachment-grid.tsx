"use client"

/* Attachment grid with an add tile and drop target. The parent owns the files. */

import { FileTextIcon, PlusIcon, XIcon } from "lucide-react"
import Image from "next/image"
import React from "react"
import { formatBytes, useFileUpload } from "@/app/hooks/use-file-upload"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"
import TodoAttachmentViewer from "./todo-attachment-viewer"

export const MAX_FILES = 10
const MAX_SIZE = 2 * 1024 * 1024

export type Attachment = {
  id: string
  url: string | null
  contentType?: string
  size: number
}

type Props = {
  attachments: Attachment[]
  /* Files that upload now. Each one shows a spinner tile. */
  pendingCount?: number
  disabled?: boolean
  onAdd: (files: File[]) => void
  onRemove: (id: string) => void
}

export default function TodoAttachmentGrid({
  attachments,
  pendingCount = 0,
  disabled = false,
  onAdd,
  onRemove,
}: Props) {
  const total = attachments.length + pendingCount
  const [isViewerOpen, setIsViewerOpen] = React.useState(false)
  /* Keep the ID after the dialog closes, so the content stays during the close animation */
  const [viewerStartId, setViewerStartId] = React.useState<string | null>(null)

  const [
    { isDragging },
    {
      clearFiles,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({
    multiple: true,
    maxSize: MAX_SIZE,
    /* The hook keeps its own file list. Take the files and clear the list, or the hook rejects the same file again as a duplicate. */
    onFilesChange: (added) => {
      if (added.length === 0) return
      clearFiles()
      const files = added.flatMap(({ file }) =>
        file instanceof File ? [file] : []
      )
      if (total + files.length > MAX_FILES) {
        toast.error(`A todo can have up to ${MAX_FILES} files.`)
        return
      }
      onAdd(files)
    },
    onError: (errors) => {
      for (const error of errors) toast.error(error)
    },
  })

  const canAdd = !disabled && total < MAX_FILES

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "grid grid-cols-[repeat(auto-fill,5rem)] gap-2 rounded-md transition-shadow",
          isDragging &&
            !disabled &&
            "ring-2 ring-ring ring-offset-4 ring-offset-background"
        )}
      >
        {attachments.map((item, index) => {
          const label = `Attachment ${index + 1} of ${attachments.length}`
          const preview =
            item.contentType?.startsWith("image/") && item.url ? (
              <Image
                src={item.url}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <span className="flex flex-col items-center gap-1">
                <FileTextIcon className="size-5" />
                <span className="text-xs">{formatBytes(item.size, 1)}</span>
              </span>
            )
          const tileClass =
            "relative flex aspect-square items-center justify-center overflow-hidden rounded-md border bg-muted text-muted-foreground"

          return (
            <div key={item.id} className="group/tile relative">
              {item.url ? (
                <button
                  type="button"
                  aria-label={`View ${label.toLowerCase()}`}
                  onClick={() => {
                    setViewerStartId(item.id)
                    setIsViewerOpen(true)
                  }}
                  className={cn(
                    tileClass,
                    "w-full pressable outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  {preview}
                </button>
              ) : (
                <div className={tileClass}>{preview}</div>
              )}
              {disabled ? null : (
                <button
                  type="button"
                  aria-label={`Remove ${label.toLowerCase()}`}
                  onClick={() => onRemove(item.id)}
                  className="absolute top-1 right-1 flex size-6 pressable items-center justify-center rounded-full bg-background text-foreground opacity-0 shadow-sm transition-opacity outline-none group-focus-within/tile:opacity-100 group-hover/tile:opacity-100 group-active/tile:opacity-100 hover:bg-button-outline-hover focus-visible:ring-2 focus-visible:ring-ring active:bg-button-outline-hover"
                >
                  <XIcon className="size-3.5" />
                </button>
              )}
            </div>
          )
        })}

        {Array.from({ length: pendingCount }, (_, index) => (
          <div
            key={`pending-${index}`}
            className="flex aspect-square items-center justify-center rounded-md border bg-muted"
          >
            <Spinner />
          </div>
        ))}

        {canAdd ? (
          <button
            type="button"
            onClick={openFileDialog}
            className="flex aspect-square pressable flex-col items-center justify-center gap-1 rounded-md border border-dashed border-ring text-xs font-medium text-muted-foreground outline-none hover:bg-button-ghost-hover focus-visible:ring-2 focus-visible:ring-ring active:bg-button-ghost-hover"
          >
            <PlusIcon className="size-4" />
            Add
          </button>
        ) : null}
        {/* The hook ignores a drop when the input is disabled */}
        <input {...getInputProps()} disabled={disabled} className="sr-only" />
      </div>
      <p className="text-xs text-muted-foreground">
        Drop files here. Up to {MAX_FILES} files, {formatBytes(MAX_SIZE, 0)}{" "}
        each.
      </p>
      {/* React events bubble through a portal. Stay outside the drop target, or a drag in the dialog reaches its handlers. */}
      <TodoAttachmentViewer
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        attachments={attachments}
        startId={viewerStartId}
      />
    </div>
  )
}
