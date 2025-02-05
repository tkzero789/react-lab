import React from "react";

export default function TodoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto w-full max-w-7xl px-8 py-16">{children}</div>;
}
