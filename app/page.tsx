import Nextjs from "@/components/icons/nextjs-icon";
import Replicas from "@/components/icons/replicas-icon";
import Threejs from "@/components/icons/threejs-icon";
import Link from "next/link";

const cardItems = [
  {
    icon: Threejs,
    iconBackground: "bg-gradient-to-b from-yellow-300/70  to-yellow-600/80",
    title: "Three.js",
    href: "/threejs",
    hoverBackground: "hover:bg-yellow-400/40",
  },
  {
    icon: Replicas,
    iconBackground: "bg-gradient-to-b from-green-300/70 to-green-500",
    title: "Replicas",
    href: "/replicas",
    hoverBackground: "hover:bg-green-400/40",
  },
  {
    icon: Nextjs,
    iconBackground: "bg-gradient-to-b from-slate-400/50 to-slate-700/90",
    title: "Apps",
    href: "/apps",
    hoverBackground: "hover:bg-slate-400/40",
  },
];

export default function Page() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-16">
      <h1>React Lab</h1>
      <div className="grid place-items-center gap-8 md:grid-cols-3">
        {cardItems.map((item) => (
          <Link
            href={item.href}
            key={item.title}
            className={`group size-40 rounded-xl bg-muted p-2 transition-all duration-300 lg:size-48 ${item.hoverBackground}`}
          >
            <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl bg-background">
              <div
                className={`flex size-14 items-center justify-center rounded-xl p-2 transition-all duration-300 group-hover:scale-105 ${item.iconBackground}`}
              >
                <item.icon />
              </div>
              <div className="flex items-center justify-center font-medium">
                {item.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
