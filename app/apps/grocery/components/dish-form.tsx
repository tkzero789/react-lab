import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "@/lib/toast"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

function normalize(str: string) {
  return str.replace(/\s+/g, "").toLowerCase()
}

export default function DishForm() {
  const dishes = useQuery(api.dishes.list) ?? []
  const addDish = useMutation(api.dishes.add)
  const removeDish = useMutation(api.dishes.remove)

  const [dishName, setDishName] = React.useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!dishName.trim()) {
      toast.error("Dish name is required")
      return
    }
    const isDuplicate = dishes.some(
      (d) => normalize(d.name) === normalize(dishName)
    )
    if (isDuplicate) {
      toast.error(`"${dishName}" already exists`)
      return
    }
    addDish({ name: dishName.trim() })
    toast.success(`Added dish "${dishName.trim()}"`)
    setDishName("")
  }

  function handleRemove(dishId: Id<"dishes">) {
    removeDish({ id: dishId })
    toast.info("Dish deleted")
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
          placeholder="Dish"
        />
        <Button type="submit">
          <Plus className="size-4" />
          Add
        </Button>
      </form>
      {dishes.length > 0 && (
        <div className="flex flex-col gap-2">
          {dishes.map((dish) => (
            <div
              key={dish._id}
              className="flex items-center justify-between rounded-lg bg-muted px-4 py-2 text-sm"
            >
              <span className="font-medium">{dish.name}</span>

              <Dialog>
                <DialogTrigger
                  render={
                    <Button variant="ghost" size="icon-sm">
                      <Trash2 />
                    </Button>
                  }
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete dish</DialogTitle>
                  </DialogHeader>
                  <DialogBody>{dish.name}</DialogBody>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleRemove(dish._id)}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
