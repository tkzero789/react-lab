import { CalendarIcon, Link2Icon, MapPinIcon } from "lucide-react"
import { format } from "date-fns"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Todo } from "../types"

export default function TodoItem({
  todo,
  onSelect,
  selected,
}: {
  todo: Todo
  onSelect: (todo: Todo) => void
  selected: Todo | null
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(todo)}
        className={cn(
          "flex w-full pressable flex-col gap-2 rounded-xl border bg-card p-4 text-left hover:border-ring",
          selected?._id === todo._id && "border-ring"
        )}
      >
        <div className="text-sm font-medium">{todo.text}</div>

        {todo.date !== 0 && (
          <div className="flex items-center gap-4 text-sm">
            <CalendarIcon className="size-4 shrink-0" />
            {format(new Date(todo.date), "EEE, MMM d, yyyy")}
          </div>
        )}
        {todo.location && (
          <div className="flex items-center gap-4 text-sm">
            <MapPinIcon className="size-4 shrink-0" /> {todo.location}
          </div>
        )}
        <div className="flex w-full items-center gap-2">
          {todo.imageObject.map((image, index) => {
            return image?.url ? (
              <AspectRatio
                key={image.storageId}
                ratio={1 / 1}
                className={cn(
                  "w-full max-w-16 overflow-hidden rounded-xl border bg-background",
                  index > 3 && "hidden"
                )}
              >
                <Image
                  src={image.url}
                  alt="Todo image"
                  fill
                  className="object-cover"
                />
              </AspectRatio>
            ) : null
          })}
          {todo.imageObject.length > 4 && (
            <AspectRatio
              ratio={1 / 1}
              className="flex w-full max-w-16 items-center justify-center overflow-hidden rounded-xl border bg-muted"
            >
              +{todo.imageObject.length - 4}
            </AspectRatio>
          )}
        </div>
      </button>
    </li>
  )
}
