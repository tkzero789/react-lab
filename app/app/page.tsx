import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apps",
};

export default function AppPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <h1>Apps</h1>
    </div>
  );
}
