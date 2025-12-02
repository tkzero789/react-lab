"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpFromLine, Eye, Thermometer, Waves, Wind } from "lucide-react";
import { toast } from "sonner";
import Container from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const APIKEY = "2ee9027cb53bdd718773abe1ca5efd36";

interface Weather {
  name: string;
  sys: {
    country: string;
  };
  weather: [
    {
      main: string;
      icon: string;
      description: string;
    },
  ];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  visibility: number;
}

export default function WeatherPage() {
  const [weatherData, setWeatherData] = React.useState<Weather>();
  const [city, setCity] = React.useState<string>("");

  const handleOnClick = async (city: string) => {
    if (city.trim() === "") {
      toast.error("Empty input");
      return;
    } else {
      try {
        const getData = async () => {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=imperial`,
          );
          const data = await response.json();
          console.log(data);
          if (data.cod === "404") {
            toast.error("City not found");
            return;
          } else {
            setWeatherData(data);
          }
        };
        await getData();
      } catch (error) {
        window.alert(error);
      }
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const formatText = (text: string) => {
    const splitText = text.split(" ");
    const newText = [];
    for (let i = 0; i < splitText.length; i++) {
      newText.push(
        splitText[i].slice(0, 1).toUpperCase() + splitText[i].slice(1),
      );
    }
    return newText.join(" ");
  };

  return (
    <Container className="max-w-2xl">
      <h1>Weather</h1>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Weather info</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="" className="flex justify-between gap-4">
            <Input
              value={city}
              onChange={(e) => handleOnChange(e)}
              placeholder="Enter city"
            />
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleOnClick(city);
              }}
            >
              Find
            </Button>
          </form>
          {weatherData && (
            <div className="mt-4 flex flex-col gap-8 rounded-xl border p-4">
              {/* City & country */}
              <div className="flex justify-between">
                <h3>
                  <span className="font-medium">City:</span> {weatherData?.name}
                </h3>
                <h3>
                  <span className="font-medium">Country:</span>{" "}
                  {weatherData?.sys.country}
                </h3>
              </div>
              {/* Temperature & description */}
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold">
                  {weatherData?.main.temp.toFixed()}°F
                </div>
                <div className="font-medium">
                  {formatText(weatherData?.weather[0].description || "")}
                </div>
              </div>
              {/* Humidify & Wind */}
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Waves className="h-11 w-11" strokeWidth={1} />
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold">
                      {weatherData?.main.humidity.toFixed()} %
                    </span>
                    <span>Humidity</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-11 w-11" strokeWidth={1} />
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold">
                      {weatherData?.wind.speed.toFixed()} mph
                    </span>
                    <span>Wind</span>
                  </div>
                </div>
              </div>
              {/* Temp high/low, Pressure & Visibility */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center">
                  <span className="w-[45%]">
                    <Thermometer />
                  </span>
                  <span>High/Low</span>
                  <span className="ml-auto">
                    {weatherData?.main.temp_max.toFixed()}°/
                    {weatherData?.main.temp_min.toFixed()}°
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-[45%]">
                    <ArrowUpFromLine />
                  </span>
                  <span>Pressure</span>
                  <span className="ml-auto">
                    {(
                      Number(weatherData?.main.pressure) * 0.029529983071445
                    ).toFixed()}{" "}
                    in
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-[45%]">
                    <Eye />
                  </span>
                  <span className="">Visibility</span>
                  <span className="ml-auto">
                    {(Number(weatherData?.visibility) * 0.00062137).toFixed()}{" "}
                    mi
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
