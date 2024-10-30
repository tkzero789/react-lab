"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const BASE_URL = "https://restcountries.com/v3.1";

const FILTERABLE_CAPITALS = [
  "Tallinn",
  "Helsinki",
  "Stockholm",
  "Oslo",
  "Copenhagen",
  "Reykjavik",
] as const;
type Capital = (typeof FILTERABLE_CAPITALS)[number];

interface Country {
  name: {
    common: string;
  };
  capital: string;
}

type CountryProps = {
  name: string;
  capital: string;
};

export function Country({ name, capital }: CountryProps) {
  return (
    <div className="flex justify-between rounded-lg border p-2">
      <div className="font-medium text-blue-700">{name}</div>
      <div>{capital}</div>
    </div>
  );
}

export default function Page() {
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [capital, setCapital] = React.useState<Capital | "">("");

  React.useEffect(() => {
    const getCountry = async () => {
      try {
        const url = capital
          ? `${BASE_URL}/capital/${capital}`
          : `${BASE_URL}/all`;
        const data = await fetch(url).then((res) => res.json());
        setCountries(data);
      } catch (error) {
        console.log(error);
      }
    };
    getCountry();
  }, [capital]);

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCapital = e.target.value as Capital;
    setCapital(selectedCapital);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Interview 1</h1>
      <Collapsible className="mt-4 flex flex-col gap-4 rounded-md border p-2">
        <CollapsibleTrigger className="rounded-sm bg-blue-300 p-2 font-semibold dark:bg-transparent">
          Challenge
        </CollapsibleTrigger>
        <CollapsibleContent className="rounded-sm [[data-state=open]_&]:bg-blue-100 [[data-state=open]_&]:p-8 [[data-state=open]_&]:dark:bg-transparent">
          <div className="flex flex-col gap-2">
            <p>
              Create a simple React application that displays a list of
              countries and their capitals.
            </p>
            <p>The application should have the following features:</p>
            <ul className="list-inside list-disc">
              <li>
                The list of countries and capitals should be fetched from an
                API.
              </li>
              <li>Each country should be displayed in a separate component</li>
              <li>The user should be able to filter the list by capital</li>
            </ul>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="mt-4 flex justify-between">
        <select
          name=""
          id=""
          value={capital}
          onChange={(e) => handleOnChange(e)}
          className="mt-4"
        >
          <option value="">Select capital</option>
          {FILTERABLE_CAPITALS.map((capital) => (
            <option value={capital} key={capital}>
              {capital}
            </option>
          ))}
        </select>
        <Button>Reset</Button>
      </div>
      <div className="mt-4">
        Selected capital: <span className="font-semibold">{capital}</span>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {countries.map((item) => (
          <Country
            key={item.name.common}
            name={item.name.common}
            capital={item.capital}
          />
        ))}
      </div>
    </div>
  );
}
