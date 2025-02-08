import Image from "next/image";
import React from "react";
import Appwrite from "@/public/images/appwrite/appwrite.png";
import Link from "next/link";
import Replicas from "@/components/icons/replicas-icon";

const replicas = [
  {
    title: "Appwrite",
    img: Appwrite,
    href: "/replicas/appwrite",
  },
  {
    title: "Supabase",
    img: Appwrite,
    href: "/",
  },
  {
    title: "Texo",
    img: Appwrite,
    href: "/",
  },
];

export default function ReplicasPage() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-16 bg-green-100">
      <div className="flex flex-col items-center gap-6">
        <div className="flex w-fit items-center justify-center rounded-2xl bg-gradient-to-b from-green-300/70 to-green-500 p-4 transition-all duration-300 group-hover:scale-105">
          <Replicas />
        </div>
        <h1 className="text-4xl font-bold">Replicas</h1>
      </div>
      <div className="grid w-full max-w-5xl grid-cols-3 gap-8">
        {replicas.map((item) => (
          <Link
            href={item.href}
            key={item.title}
            className="group flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <Image
              src={item.img}
              width={340}
              height={220}
              alt="Application image"
              className="rounded-xl"
            />

            <h2 className="text-xl font-semibold group-hover:underline">
              {item.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
