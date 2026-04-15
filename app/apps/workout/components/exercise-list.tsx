"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Search, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MUSCLE_GROUPS } from "@/types/workout";

import ExerciseForm from "./exercise-form";

const ALL = "all";

export default function ExerciseList() {
  const isMobile = useIsMobile();
  const exercises = useQuery(api.exercises.list) ?? [];
  const updateExercise = useMutation(api.exercises.update);
  const removeExercise = useMutation(api.exercises.remove);

  const [editId, setEditId] = React.useState<Id<"exercises"> | null>(null);
  const [search, setSearch] = React.useState("");
  const [muscle, setMuscle] = React.useState<string>(ALL);
  const toastPos = isMobile ? "top-center" : ("bottom-right" as const);

  function handleUpdate(
    id: Id<"exercises">,
    data: { name: string; muscleGroups: string[]; personalBest: number },
  ) {
    updateExercise({ id, ...data });
    setEditId(null);
    toast.success("Exercise updated", { position: toastPos });
  }

  function handleRemove(id: Id<"exercises">) {
    removeExercise({ id });
    toast.info("Exercise deleted", { position: toastPos });
  }

  const query = search.trim().toLowerCase();
  const filtered = exercises.filter((e) => {
    const matchesName = query ? e.name.toLowerCase().includes(query) : true;
    const matchesMuscle =
      muscle === ALL ? true : e.muscleGroups.includes(muscle);
    return matchesName && matchesMuscle;
  });

  return (
    <div className="flex flex-1 flex-col gap-3 px-4">
      <div className="flex flex-col gap-2 lg:flex-row">
        <InputGroup className="flex-1">
          <InputGroupInput
            placeholder="Search exercises"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Select value={muscle} onValueChange={setMuscle}>
          <SelectTrigger className="w-full lg:w-1/5">
            <SelectValue placeholder="Muscle" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={ALL}>All muscles</SelectItem>
              {MUSCLE_GROUPS.map((mg) => (
                <SelectItem key={mg} value={mg}>
                  {mg}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {exercises.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No exercises yet. Add one below to get started.
        </p>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No exercises match your filters.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((exercise) => (
            <Card key={exercise._id}>
              <CardContent className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{exercise.name}</span>
                    {exercise.personalBest > 0 && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Trophy className="h-3 w-3" />
                        {exercise.personalBest} lbs
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {exercise.muscleGroups.map((mg) => (
                      <Badge key={mg} variant="secondary" className="text-xs">
                        {mg}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Dialog
                    open={editId === exercise._id}
                    onOpenChange={(open) =>
                      setEditId(open ? exercise._id : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <Pencil />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Exercise</DialogTitle>
                      </DialogHeader>
                      <DialogBody className="flex flex-1 flex-col p-0">
                        <ExerciseForm
                          initial={{
                            name: exercise.name,
                            muscleGroups: exercise.muscleGroups,
                            personalBest: exercise.personalBest,
                          }}
                          submitLabel="Save Changes"
                          onSubmit={(data) => handleUpdate(exercise._id, data)}
                        />
                      </DialogBody>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost-destructive"
                    size="icon-sm"
                    onClick={() => handleRemove(exercise._id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
