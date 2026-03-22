import type { Ingredient } from "../types";

type Props = {
  ingredients: Ingredient[];
};

export default function GroceryStats({ ingredients }: Props) {
  const total = ingredients.reduce((sum, i) => sum + i.price, 0);
  const checkedTotal = ingredients
    .filter((i) => i.checked)
    .reduce((sum, i) => sum + i.price, 0);

  return (
    <div className="grid flex-1 grid-cols-3 rounded-xl bg-secondary p-4 text-secondary-foreground">
      <div className="flex flex-col items-center gap-1">
        List
        <span className="font-medium">
          ({ingredients.length} item
          {ingredients.length !== 1 ? "s" : ""})
        </span>
      </div>
      <div className="flex flex-col items-center gap-1">
        Checked{" "}
        <span className="font-medium">${checkedTotal.toFixed(2)}</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        Total <span className="font-medium">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
