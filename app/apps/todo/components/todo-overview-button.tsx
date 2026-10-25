"use client"

/* Side panel button that goes back to the overview */

import { Minimize2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Props = {
  onClick: () => void
  className?: string
}

export default function TodoOverviewButton({ onClick, className }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            aria-keyshortcuts="Escape"
            onClick={onClick}
            className={className}
          />
        }
      >
        <Minimize2Icon />
      </TooltipTrigger>
      <TooltipContent>
        Close
        <Kbd>Esc</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
