import React from "react";
import AppwriteLogo from "@/public/icons/appwrite/appwrite-logo.svg";
import Image from "next/image";
import { ChevronDown, Star } from "lucide-react";
import Link from "next/link";

const navLink = ["Products", "Docs", "Pricing"];

export default function AppwriteHeader() {
  return (
    <header className="relative z-50 min-h-[4.5625rem] border-b-[0.0625rem] border-[#ffffff1a] px-16">
      <nav className="mx-auto flex w-full max-w-[108rem] justify-between py-[15px]">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Image
              src={AppwriteLogo}
              alt="Appwrite Logo"
              width={130}
              height={24}
              className="h-[24px] w-[130px]"
            />
          </Link>
          <ul className="flex items-center gap-8">
            {navLink.map((item, index) => (
              <li
                key={index}
                className="flex cursor-pointer items-center gap-1 text-[#e4e4e7] hover:text-[#ca2b58]"
              >
                {item} {index === 0 && <ChevronDown className="h-5 w-5" />}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-[#acacaf] hover:bg-[#ffffff1a]"
          >
            <Star
              className="h-4 w-5 text-[#acacaf] text-opacity-40"
              strokeWidth={2.5}
            />
            Star on GitHub
            <div className="rounded-md bg-[#ffffff1f] px-1 py-[3px] leading-none text-[#e4e4e7]">
              47K
            </div>
          </Link>
          <button
            className="flex items-center justify-center rounded-lg px-[14px] py-2 font-medium text-[#e4e4e7]"
            style={{
              background:
                "linear-gradient(135deg, #fd356e, #fd356e 61%, #fe526c)",
            }}
          >
            <span>Start building</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
