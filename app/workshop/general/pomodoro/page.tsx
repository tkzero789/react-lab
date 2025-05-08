"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export default function PomodoroPage() {
  const [time, setTime] = React.useState<number>(0);
  const [isStarted, setIsStarted] = React.useState<boolean>(false);
  const timerId = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const startTimer = () => {
    setIsStarted(true);
    timerId.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerId.current) {
      clearInterval(timerId.current);
      timerId.current = undefined;
      setIsStarted(false);
    }
  };

  const resetTimer = () => {
    if (timerId.current) {
      clearInterval(timerId.current);
      timerId.current = undefined;
      setIsStarted(false);
      setTime(0);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold">Pomodoro</h1>
      <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-neutral-100 p-2">
        <div className="flex w-full flex-col items-center gap-4 rounded-xl border bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold">Timer</h2>
          <div className="text-8xl font-bold">{time}</div>
          <div className="flex items-center gap-8">
            <Button variant="outline" onClick={resetTimer}>
              Reset
            </Button>
            <Button
              variant={isStarted ? "destructive" : "default"}
              onClick={isStarted ? stopTimer : startTimer}
            >
              {timerId.current === undefined
                ? "Start"
                : isStarted
                  ? "Stop"
                  : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
