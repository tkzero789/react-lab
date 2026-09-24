/* Square exercise image with a placeholder icon */

import Image from "next/image"
import { DumbbellIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  src?: string | null
  /* Rendered width in px. next/image uses it to pick a small source file. */
  size?: number
  className?: string
}

export default function ExerciseThumbnail({
  src,
  size = 64,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground",
        className
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        /* Empty alt because the exercise name is always next to the image */
        <Image
          src={src}
          alt=""
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <DumbbellIcon className="size-1/3" />
      )}
    </div>
  )
}
