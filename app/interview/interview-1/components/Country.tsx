interface Country {
  name: {
    common: string;
  };
  capital: string;
}

export function Country({ name, capital }: Country) {
  return (
    <div className="flex flex-col rounded-lg border bg-white p-4 shadow-sm">
      <div className="font-medium text-blue-600">{name.common}</div>
      <div className="text-sm">{capital}</div>
    </div>
  );
}
