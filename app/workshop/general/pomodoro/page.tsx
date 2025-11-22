"use client";

import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Container className="max-w-xl">
      <h1 className="text-2xl font-semibold">Pomodoro</h1>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-center">Timer</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
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
        </CardContent>
      </Card>
    </Container>
  );
}
