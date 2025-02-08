import Image from "next/image";
import React from "react";
import Link from "next/link";
import Replicas from "@/components/icons/replicas-icon";
import Appwrite from "@/public/images/appwrite/appwrite.png";
import PortOfVirginia from "@/public/images/portofvirginia/portofvirginia.webp";
import Emirates from "@/public/images/emirates/emirates.webp";
import TelaDochealth from "@/public/images/teladochealth/teladochealth.webp";
import Spotify from "@/public/images/spotify/spotify.webp";
import Sixsenses from "@/public/images/sixsenses/sixsenses.webp";

const replicas = [
  {
    title: "Appwrite",
    img: Appwrite,
    href: "/replicas/appwrite",
  },
  {
    title: "The Port of Virginia",
    img: PortOfVirginia,
    href: "/",
  },
  {
    title: "Emirates",
    img: Emirates,
    href: "/",
  },
  {
    title: "TelaDochealth",
    img: TelaDochealth,
    href: "/",
  },
  {
    title: "Spotify",
    img: Spotify,
    href: "/",
  },
  {
    title: "Sixsenses",
    img: Sixsenses,
    href: "/",
  },
];

export default function ReplicasPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-16 bg-green-50/50 py-16">
      <div className="flex flex-col items-center gap-6">
        <div className="flex w-fit items-center justify-center rounded-2xl bg-gradient-to-b from-green-300/70 to-green-500 p-4 transition-all duration-300 group-hover:scale-105">
          <Replicas />
        </div>
        <h1 className="text-4xl font-bold">Replicas</h1>
      </div>
      <div className="grid w-full max-w-7xl gap-10 px-4 lg:grid-cols-2 xl:grid-cols-3 xl:px-0">
        {replicas.map((item) => (
          <Link
            href={item.href}
            key={item.title}
            className="group flex flex-col rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="overflow-hidden rounded-t-3xl">
              <Image
                src={item.img}
                width={400}
                height={220}
                alt="Application image"
                className="h-full w-full rounded-t-3xl transition-all duration-300 group-hover:scale-105"
              />
            </div>

            <h2 className="border-t p-4 text-lg font-semibold group-hover:underline">
              {item.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
