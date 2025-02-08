import Image from "next/image";
import React from "react";
import AppwriteHeader from "./components/Header";
import AppWriteHero from "./components/Hero";

export default function AppwritePage() {
  return (
    <main className="relative h-screen w-full bg-[#19191c]">
      <div className="absolute left-0 top-[-800px]">
        <Image
          src="/images/appwrite/top-page-dark.avif"
          alt="Top page dark blob"
          width={1500}
          height={500}
          className="h-[804px] w-[1466px] rotate-[150deg] opacity-65 blur-[127px]"
        />
      </div>
      <AppwriteHeader />
      <AppWriteHero />
    </main>
  );
}
