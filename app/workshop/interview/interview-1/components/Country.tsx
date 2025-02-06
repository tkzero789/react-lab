interface Country {
  name: {
    common: string;
  };
  capital: string;
}

export function Country({ name, capital }: Country) {
  return (
    <div className="flex flex-col rounded-lg border bg-white p-4 shadow-sm dark:bg-background">
      <div className="font-medium text-blue-600 dark:text-blue-500">
        {name.common}
      </div>
      <div className="text-sm">{capital}</div>
    </div>
  );
}
