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
  maxSize?: number
  className?: string
  onFileChange?: (file: FileWithPreview | null) => void
  defaultFile?: string
  icon?: LucideIcon
  accept?: string
  initialFile?: FileMetadata
}

export default function FileUpload({
  maxSize = 2 * 1024 * 1024, // 2MB
  className,
  onFileChange,
  defaultFile,
  icon: Icon = PlusIcon,
  accept = "image/*",
  initialFile,
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
    maxFiles: 1,
    maxSize,
    accept,
    initialFiles: initialFile ? [initialFile] : undefined,
    multiple: false,
    onFilesChange: (files) => {
      onFileChange?.(files[0] || null)
    },
    onError: (errors) => {
      for (const error of errors) toast.error(error)
    },
  })
  const currentFile = files[0]
  const previewUrl = currentFile?.preview || defaultFile
  const handleRemove = () => {
    if (currentFile) {
      removeFile(currentFile.id)
    }
  }

  return (
    <>
      {/* File preview */}
      <div className="relative">
        <div
          className={cn(
            "group/avatar relative size-16 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors hover:bg-muted",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/20",
            previewUrl && "border-solid",
            className
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input {...getInputProps()} className="sr-only" />
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Avatar"
              width={100}
              height={100}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Icon className="size-4 text-muted-foreground" />
            </div>
          )}
        </div>
        {/* Remove Button */}
        {currentFile && (
          <Button
            size="icon"
            variant="outline"
            onClick={handleRemove}
            className="absolute inset-e-0.5 top-0.5 z-10 size-6 rounded-full"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
      </div>
    </>
  )
}
