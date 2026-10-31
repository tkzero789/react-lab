"use client"

/* Attachments of a saved todo. A file uploads and saves as soon as you add it. */

import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "@tanstack/react-query"
import { useUploadFile } from "@/hooks/use-upload-file"
import { toast } from "@/lib/toast"
import TodoAttachmentGrid, { Attachment } from "./todo-attachment-grid"
import { Todo } from "../types"

type Props = {
  todo: Todo
  onSave: (image: Id<"_storage">[]) => void
}

export default function TodoAttachments({ todo, onSave }: Props) {
  const uploadFile = useUploadFile()

  /* A missing file has no object. Saving from this list drops its dead ID. */
  const files = todo.imageObject.flatMap((item) => (item ? [item] : []))
  const ids = files.map((item) => item.storageId)
  const attachments: Attachment[] = files.map((item) => ({
    id: item.storageId,
    url: item.url,
    contentType: item.contentType,
    size: item.size,
  }))

  const upload = useMutation({
    mutationFn: (files: File[]) => Promise.all(files.map(uploadFile)),
    onSuccess: (uploaded) => onSave([...ids, ...uploaded]),
    onError: (error) => toast.error(error.message),
  })

  return (
    <TodoAttachmentGrid
      attachments={attachments}
      pendingCount={upload.isPending ? upload.variables.length : 0}
      onAdd={(files) => upload.mutate(files)}
      onRemove={(id) => onSave(ids.filter((item) => item !== id))}
    />
  )
}
