/* Shared math and formatting for logged workout sets */

import type { Doc } from "@/convex/_generated/dataModel"

type Sets = Doc<"workoutLogs">["sets"]

export const numberFormat = new Intl.NumberFormat("en-US")

export function formatWeight(weight: number) {
  return weight === 0 ? "Bodyweight" : `${numberFormat.format(weight)} lbs`
}

export function formatSet(set: Sets[number]) {
  return set.weight === 0
    ? `${set.reps} reps`
    : `${formatWeight(set.weight)} × ${set.reps}`
}

export function getTopSet(sets: Sets) {
  return sets.reduce<Sets[number] | undefined>(
    (top, set) =>
      !top ||
      set.weight > top.weight ||
      (set.weight === top.weight && set.reps > top.reps)
        ? set
        : top,
    undefined
  )
}

export function getVolume(sets: Sets) {
  return sets.reduce((sum, set) => sum + set.reps, 0)
}
