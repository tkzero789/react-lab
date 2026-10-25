"use client"

/* Attachment grid in the todo panel. A file uploads as soon as you add it. */

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { FileTextIcon, PlusIcon, XIcon } from "lucide-react"
import Image from "next/image"
import { formatBytes, useFileUpload } from "@/app/hooks/use-file-upload"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"
import { Todo } from "../types"

const MAX_FILES = 10
const MAX_SIZE = 2 * 1024 * 1024

type Props = {
  todo: Todo
  onSave: (image: Id<"_storage">[]) => void
}

export default function TodoAttachments({ todo, onSave }: Props) {
  const generateUploadUrl = useConvexMutation(api.files.generateUploadUrl)

  /* A missing file has no object. Saving from this list drops its dead ID. */
  const attachments = todo.imageObject.flatMap((item) => (item ? [item] : []))
  const ids = attachments.map((item) => item.storageId)

  async function uploadFile(file: File) {
    const postUrl = await generateUploadUrl()
    const response = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    })
    if (!response.ok) throw new Error(`Could not upload ${file.name}`)
    const { storageId } = (await response.json()) as {
      storageId: Id<"_storage">
    }
    return storageId
  }

  const upload = useMutation({
    mutationFn: (files: File[]) => Promise.all(files.map(uploadFile)),
    onSuccess: (uploaded) => onSave([...ids, ...uploaded]),
    onError: (error) => toast.error(error.message),
    /* The hook keeps its own file list. Clear it, or it rejects the same file again as a duplicate. */
    onSettled: () => clearFiles(),
  })

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
    onFilesAdded: (added) => {
      const files = added.flatMap(({ file }) =>
        file instanceof File ? [file] : []
      )
      if (attachments.length + files.length > MAX_FILES) {
        toast.error(`A todo can have up to ${MAX_FILES} files.`)
        return
      }
      upload.mutate(files)
    },
    onError: (errors) => {
      for (const error of errors) toast.error(error)
    },
  })

  const uploadingCount = upload.isPending ? upload.variables.length : 0
  const canAdd = attachments.length + uploadingCount < MAX_FILES

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "grid grid-cols-[repeat(auto-fill,5rem)] gap-2 rounded-md transition-shadow",
          isDragging && "ring-2 ring-ring ring-offset-4 ring-offset-panel"
        )}
      >
        {attachments.map((item, index) => {
          const isImage = item.contentType?.startsWith("image/") ?? true
          const label = `Attachment ${index + 1} of ${attachments.length}`
          const preview = isImage && item.url ? (
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
            <div key={item.storageId} className="group/tile relative">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${label.toLowerCase()}`}
                  className={cn(
                    tileClass,
                    "pressable outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  {preview}
                </a>
              ) : (
                <div className={tileClass}>{preview}</div>
              )}
              <button
                type="button"
                aria-label={`Remove ${label.toLowerCase()}`}
                onClick={() =>
                  onSave(ids.filter((id) => id !== item.storageId))
                }
                className="pressable absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-background text-foreground opacity-0 shadow-sm transition-opacity outline-none group-hover/tile:opacity-100 group-focus-within/tile:opacity-100 group-active/tile:opacity-100 hover:bg-button-outline-hover focus-visible:ring-2 focus-visible:ring-ring active:bg-button-outline-hover"
              >
                <XIcon className="size-3.5" />
              </button>
            </div>
          )
        })}

        {Array.from({ length: uploadingCount }, (_, index) => (
          <div
            key={`uploading-${index}`}
            className="flex aspect-square items-center justify-center rounded-md border bg-muted"
          >
            <Spinner />
          </div>
        ))}

        {canAdd ? (
          <button
            type="button"
            onClick={openFileDialog}
            className="pressable flex aspect-square flex-col items-center justify-center gap-1 rounded-md border border-dashed border-ring text-xs font-medium text-muted-foreground outline-none hover:bg-button-ghost-hover focus-visible:ring-2 focus-visible:ring-ring active:bg-button-ghost-hover"
          >
            <PlusIcon className="size-4" />
            Add
          </button>
        ) : null}
        <input {...getInputProps()} className="sr-only" />
      </div>
      <p className="text-xs text-muted-foreground">
        Drop files here. Up to {MAX_FILES} files, {formatBytes(MAX_SIZE, 0)}{" "}
        each.
      </p>
    </div>
  )
}
