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
  },
  {
    icon: Replicas,
    iconBackground: "bg-gradient-to-b from-green-300/70 to-green-500",
    title: "Replicas",
    href: "/replicas",
  },
  {
    icon: Nextjs,
    iconBackground: "bg-gradient-to-b from-slate-400/50 to-slate-700/90",
    title: "Workshop",
    href: "/workshop",
  },
];

export default function Page() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-16">
      <h1 className="text-4xl font-bold"> React Lab</h1>
      <div className="grid h-48 w-full max-w-4xl grid-cols-3 gap-8">
        {cardItems.map((item) => (
          <Link
            href={item.href}
            key={item.title}
            className="group flex h-full flex-col items-center justify-center gap-6 rounded-3xl border bg-white transition-all duration-300 hover:border-neutral-500"
          >
            <div
              className={`flex items-center justify-center rounded-2xl p-4 transition-all duration-300 group-hover:scale-105 ${item.iconBackground}`}
            >
              <item.icon />
            </div>
            <div className="flex items-center justify-center text-lg font-semibold">
              {item.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
