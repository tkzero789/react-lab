/* Sticky menu bar that opens the left panel when the panel does not fit in the window */

import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  onOpen: () => void
}

export default function TodoMenu({ onOpen }: Props) {
  return (
    <div className="sticky top-0 z-10 bg-background p-4 md:hidden">
      <Button variant="muted" onClick={onOpen}>
        <MenuIcon />
        Menu
      </Button>
    </div>
  )
}
