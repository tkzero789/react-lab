"use client"

/* Dialog that shows the attachments of a todo in a carousel */

import useEmblaCarousel from "embla-carousel-react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileTextIcon,
} from "lucide-react"
import { useReducedMotion } from "motion/react"
import React from "react"
import { formatBytes } from "@/app/hooks/use-file-upload"
import { Button } from "@/components/ui/button"
import { CarouselContainer, CarouselItem } from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Attachment } from "./todo-attachment-grid"

type ViewableAttachment = Attachment & { url: string }

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  attachments: Attachment[]
  startId: string | null
}

export default function TodoAttachmentViewer({
  open,
  onOpenChange,
  attachments,
  startId,
}: Props) {
  const viewable = attachments.flatMap((item) =>
    item.url ? [{ ...item, url: item.url }] : []
  )

  return (
    <Dialog open={open && viewable.length > 0} onOpenChange={onOpenChange}>
      <DialogContent fixedHeight className="md:max-w-4xl">
        <ViewerCarousel
          attachments={viewable}
          startIndex={Math.max(
            viewable.findIndex((item) => item.id === startId),
            0
          )}
        />
      </DialogContent>
    </Dialog>
  )
}

function ViewerCarousel({
  attachments,
  startIndex,
}: {
  attachments: ViewableAttachment[]
  startIndex: number
}) {
  /* Embla restarts when an option changes. Hold the first index, so a change to the list does not move the user. */
  const [initialIndex] = React.useState(startIndex)
  const [selectedIndex, setSelectedIndex] = React.useState(startIndex)
  const count = attachments.length
  const hasMany = count > 1

  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: initialIndex,
    watchDrag: hasMany,
  })
  const reducedMotion = useReducedMotion() ?? false

  React.useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on("select", onSelect).on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect)
    }
  }, [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
      /* The arrow keys seek in a media element */
      if (
        event.target instanceof Element &&
        event.target.closest("video, audio")
      ) {
        return
      }
      event.preventDefault()
      if (event.key === "ArrowLeft") emblaApi?.scrollPrev(reducedMotion)
      else emblaApi?.scrollNext(reducedMotion)
    }

    /* The dialog popup stops keydown propagation, so listen in the capture phase */
    document.addEventListener("keydown", onKeyDown, true)
    return () => document.removeEventListener("keydown", onKeyDown, true)
  }, [emblaApi, reducedMotion])

  const current = attachments[Math.min(selectedIndex, count - 1)]

  return (
    <>
      <DialogHeader
        actions={
          current ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Open in a new tab"
                    nativeButton={false}
                    render={
                      <a href={current.url} target="_blank" rel="noreferrer" />
                    }
                  />
                }
              >
                <ExternalLinkIcon />
              </TooltipTrigger>
              <TooltipContent>Open in a new tab</TooltipContent>
            </Tooltip>
          ) : null
        }
      >
        <DialogTitle className="truncate">
          {hasMany
            ? `Attachment ${selectedIndex + 1} of ${count}`
            : "Attachment"}
        </DialogTitle>
      </DialogHeader>

      {/* A double click on a button or a drag must not select the slide content */}
      <div className="relative mb-4 min-h-0 flex-1 select-none">
        {hasMany ? (
          /* Keep focus on the button at the first or the last file, so the keyboard user does not lose their place */
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous attachment"
            disabled={selectedIndex === 0}
            focusableWhenDisabled
            onClick={() => emblaApi?.scrollPrev(reducedMotion)}
            className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full aria-disabled:opacity-50 aria-disabled:hover:bg-background aria-disabled:active:scale-100"
          >
            <ChevronLeftIcon />
          </Button>
        ) : null}

        {/* The shared Carousel has an outer div without a height, so the slides cannot fill the dialog */}
        <div ref={emblaRef} className="h-full overflow-hidden">
          <CarouselContainer className="h-full">
            {attachments.map((item, index) => (
              <CarouselItem
                key={item.id}
                inert={index !== selectedIndex}
                /* The side padding keeps the buttons off a PDF page and its scrollbar */
                className={cn(
                  "flex h-full items-center justify-center",
                  hasMany ? "px-11" : "px-4"
                )}
              >
                <AttachmentPreview
                  item={item}
                  label={`Attachment ${index + 1}`}
                  isSelected={index === selectedIndex}
                  isNear={Math.abs(index - selectedIndex) <= 1}
                />
              </CarouselItem>
            ))}
          </CarouselContainer>
        </div>

        {hasMany ? (
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next attachment"
            disabled={selectedIndex === count - 1}
            focusableWhenDisabled
            onClick={() => emblaApi?.scrollNext(reducedMotion)}
            className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full aria-disabled:opacity-50 aria-disabled:hover:bg-background aria-disabled:active:scale-100"
          >
            <ChevronRightIcon />
          </Button>
        ) : null}
      </div>
    </>
  )
}

function AttachmentPreview({
  item,
  label,
  isSelected,
  isNear,
}: {
  item: ViewableAttachment
  label: string
  isSelected: boolean
  isNear: boolean
}) {
  /* A browser cannot decode every image or video format, such as HEIC */
  const [failed, setFailed] = React.useState(false)
  const type = item.contentType ?? ""
  const onError = () => setFailed(true)

  if (!failed && type.startsWith("image/")) {
    if (!isNear) return null
    /* Show the original file. The next/image optimizer re-encodes it, and fill scales up a small image. */
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={item.url}
        alt={label}
        draggable={false}
        onError={onError}
        className="max-h-full max-w-full rounded-md"
      />
    )
  }

  /* Mount these on the selected slide only, so a file stops loading and playing when the user leaves it */
  if (!failed && type.startsWith("video/")) {
    if (!isSelected) return null
    return (
      <video
        src={item.url}
        controls
        onError={onError}
        className="max-h-full max-w-full rounded-md"
      />
    )
  }

  if (!failed && type.startsWith("audio/")) {
    if (!isSelected) return null
    return (
      <audio
        src={item.url}
        controls
        onError={onError}
        className="w-full max-w-md"
      />
    )
  }

  /* Chrome does not show a PDF in a sandboxed frame. The allowlist keeps other file types out of this frame. */
  if (type === "application/pdf") {
    if (!isSelected) return null
    return (
      <iframe
        src={item.url}
        title={label}
        className="size-full rounded-md border"
      />
    )
  }

  if (type === "text/plain") {
    if (!isSelected) return null
    return (
      <iframe
        src={item.url}
        title={label}
        sandbox=""
        className="size-full rounded-md border bg-background"
      />
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <FileTextIcon className="size-10 text-muted-foreground" />
      <div className="flex flex-col gap-1">
        <p className="font-medium">No preview for this file</p>
        <p className="text-muted-foreground">{formatBytes(item.size, 1)}</p>
      </div>
      <Button
        variant="outline"
        nativeButton={false}
        render={<a href={item.url} download />}
      >
        <DownloadIcon data-icon="inline-start" />
        Download
      </Button>
    </div>
  )
}
