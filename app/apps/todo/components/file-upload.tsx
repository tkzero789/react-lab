import {
  FileMetadata,
  FileWithPreview,
  useFileUpload,
} from "@/app/hooks/use-file-upload"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DotIcon,
  FileTextIcon,
  LucideIcon,
  PaperclipIcon,
  PlusIcon,
  UploadIcon,
  XIcon,
} from "lucide-react"
import Image from "next/image"

import { toast } from "sonner"

type Props = {
  variant?: "default" | "dropzone"
  maxFiles?: number
  maxSize?: number
  className?: string
  onFilesChange?: (files: FileWithPreview[]) => void
  icon?: LucideIcon
  accept?: string
  initialFiles?: FileMetadata[]
}

export default function FileUpload({
  variant = "default",
  maxFiles = 1,
  maxSize = 2 * 1024 * 1024, // 2MB
  className,
  onFilesChange,
  icon: Icon = UploadIcon,
  accept = "*",
  initialFiles,
}: Props) {
  const [
    { files, isDragging },
    {
      removeFile,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    initialFiles,
    multiple: true,
    onFilesChange,
    onError: (errors) => {
      for (const error of errors) toast.error(error)
    },
  })

  const maxSizeFormatted = maxSize / 1024 / 1024

  const canAddMore = files.length < maxFiles

  return (
    <>
      {files.map((file) => (
        <Attachment key={file.id} className={cn(className)}>
          <AttachmentMedia>
            {file.preview &&
              (file.file.type.startsWith("image/") ? (
                <Image
                  src={file.preview}
                  alt={file.file.name}
                  width={100}
                  height={100}
                />
              ) : (
                <FileTextIcon />
              ))}
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{file.file.name}</AttachmentTitle>
            <AttachmentDescription>
              {file.file.type} {file.file.size}
            </AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction
              aria-label={`Delete ${file.file.name}`}
              variant="ghost-destructive"
              onClick={() => removeFile(file.id)}
            >
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}

      {canAddMore && (
        <>
          {variant === "default" && (
            <Button
              variant="outline"
              className={cn(isDragging && "bg-muted", className)}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              <PaperclipIcon /> Attach files
            </Button>
          )}
          {variant === "dropzone" && (
            <div
              className={cn(
                "flex pressable cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-background p-4 text-sm transition-colors",
                isDragging && "border-solid bg-muted",
                className
              )}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              <input {...getInputProps()} className="sr-only" />
              <Icon />
              <div>Drag & Drop or Upload a file</div>
              <div className="flex items-center text-muted-foreground">
                Max {maxFiles} files <DotIcon className="size-4" /> Up to{" "}
                {maxSizeFormatted} MB
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
