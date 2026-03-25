"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Trash2, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { format } from "date-fns";

type BodyWeight = {
  _id: Id<"bodyWeights">;
  date: string;
  weight: number;
};

type Props = {
  entries: BodyWeight[];
  onUpsert: (date: string, weight: number) => void;
  onRemove: (id: Id<"bodyWeights">) => void;
};

export default function BodyWeightTracker({
  entries,
  onUpsert,
  onRemove,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weight, setWeight] = useState("");

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const existingEntry = entries.find((e) => e.date === dateStr);

  const sortedEntries = [...entries].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const datesWithEntries = entries.map((e) => new Date(e.date + "T00:00:00"));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    onUpsert(dateStr, w);
    setWeight("");
  }

  function getTrend(index: number) {
    if (index >= sortedEntries.length - 1) return null;
    const diff = sortedEntries[index].weight - sortedEntries[index + 1].weight;
    if (diff > 0)
      return <TrendingUp className="h-3.5 w-3.5 text-red-500" />;
    if (diff < 0)
      return <TrendingDown className="h-3.5 w-3.5 text-green-500" />;
    return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Card className="shrink-0">
        <CardContent className="flex flex-col items-center gap-3 pt-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => d && setSelectedDate(d)}
            modifiers={{ logged: datesWithEntries }}
            modifiersClassNames={{
              logged:
                "!bg-primary/15 !text-primary !font-semibold rounded-md",
            }}
          />
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-2"
          >
            <Input
              type="number"
              placeholder={
                existingEntry
                  ? `Current: ${existingEntry.weight} lbs`
                  : "Weight (lbs)"
              }
              min="0"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm" disabled={!weight}>
              <Plus className="mr-1 h-4 w-4" />
              {existingEntry ? "Update" : "Log"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground">
            {format(selectedDate, "EEEE, MMM d, yyyy")}
          </p>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-base">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedEntries.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No entries yet. Select a date and log your weight.
            </p>
          ) : (
            <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
              {sortedEntries.map((entry, i) => (
                <div
                  key={entry._id}
                  className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(entry.date + "T00:00:00"), "MMM d")}
                    </span>
                    <span className="font-medium">{entry.weight} lbs</span>
                    {getTrend(i)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onRemove(entry._id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
