export default function Dock({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 flex w-full flex-col">
      <div className="pointer-events-none h-8 w-full bg-gradient-to-t from-background to-transparent" />
      {children}
    </div>
  );
}
