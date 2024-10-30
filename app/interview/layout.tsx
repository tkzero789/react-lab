import React from "react";

export default function TodoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full p-16">{children}</div>;
}
