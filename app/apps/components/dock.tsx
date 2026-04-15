export default function Dock({ children }: { children: React.ReactNode }) {
  return <div className="sticky bottom-0 flex w-full flex-col">{children}</div>;
}
