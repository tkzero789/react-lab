import {
  FileMetadata,
  FileWithPreview,
  useFileUpload,
} from "@/app/hooks/use-file-upload"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon, PlusIcon, XIcon } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

type Props = {
  maxFiles?: number
  maxSize?: number
  className?: string
  onFilesChange?: (files: FileWithPreview[]) => void
  icon?: LucideIcon
  accept?: string
  initialFiles?: FileMetadata[]
}

export default function FileUpload({
  maxFiles = 1,
  maxSize = 2 * 1024 * 1024, // 2MB
  className,
  onFilesChange,
  icon: Icon = PlusIcon,
  accept = "image/*",
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

  const canAddMore = files.length < maxFiles

  return (
    <>
      {files.map((file) => (
        <div key={file.id} className="group relative">
          <div
            className={cn(
              "aspect-square w-16 overflow-hidden rounded-xl border border-solid bg-background",
              className
            )}
          >
            {file.preview ? (
              <Image
                src={file.preview}
                alt="Upload preview"
                width={100}
                height={100}
                className="h-full w-full object-cover"
              />
            ) : null}
            <Button
              size="icon-xs"
              variant="outline"
              onClick={() => removeFile(file.id)}
              className="absolute -top-1 -right-1 z-10 hidden lg:group-hover:flex"
            >
              <XIcon />
            </Button>
          </div>
        </div>
      ))}
      {canAddMore && (
        <div
          className={cn(
            "flex aspect-square w-16 pressable cursor-pointer items-center justify-center rounded-xl border border-dashed bg-background transition-colors hover:bg-muted",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/20",
            className
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input {...getInputProps()} className="sr-only" />
          <Icon className="size-4 text-muted-foreground" />
        </div>
      )}
    </>
  )
}
