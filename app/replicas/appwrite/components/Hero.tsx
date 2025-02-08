import { ArrowRight, Play, Star } from "lucide-react";
import Link from "next/link";
import React from "react";
import styles from "../scss/hero.module.scss";

export default function AppWriteHero() {
  return (
    <div className="my-12 lg:my-[7.5rem]">
      <div className="mx-auto box-content max-w-[75rem] px-5">
        {/* New button */}
        <Link
          href="/"
          className={`mb-4 flex w-fit gap-1 rounded-[0.875rem] bg-[#fd356e14] px-2 py-1 leading-5 text-[#e4e4e7] ${styles.newButton}`}
        >
          <div className="flex items-center gap-1">
            <Star className="h-4 w-5" strokeWidth={2.5} />
            <span className={`text-sm font-medium ${styles.newButtonText}`}>
              New
            </span>
          </div>
          <div className="mx-1 h-4 w-[1px] self-center bg-[#ffffff1a]"></div>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${styles.newButtonText}`}>
              New compute options available
            </span>{" "}
            <ArrowRight className="h-4 w-5" strokeWidth={2.5} />
          </div>
        </Link>
        {/* Text */}
        <div className="relative flex">
          <h1 className={`flex-[1.3] ${styles.heroText}`}>
            <span className="block bg-[linear-gradient(6deg,_#f8a1ba,_#fff_35%)] bg-clip-text text-transparent">
              Build like a team of hundreds
              <span className="text-[#ca2b58]">_</span>
            </span>
          </h1>
          <div className="flex-1 self-end">
            <p
              className={`mt-6 font-medium text-[#acacaf] ${styles.heroTextParagraph}`}
            >
              Build your entire backend within minutes and scale effortlessly
              using Appwrite&apos;s open-source platform. Add Authentication,
              Databases, Functions, Storage, and Messaging to your projects
              using the frameworks and languages of your choice.
            </p>
            <div className="mt-8 flex gap-4">
              <button
                className="flex items-center justify-center rounded-lg px-[14px] py-2 font-medium text-[#e4e4e7]"
                style={{
                  background:
                    "linear-gradient(135deg, #fd356e, #fd356e 61%, #fe526c)",
                }}
              >
                <span>Start building</span>
              </button>
              <button
                className={`flex w-fit items-center gap-2 rounded-lg bg-[#fd356e14] px-[14px] py-[7px] leading-5 text-[#e4e4e7] ${styles.secondaryButton}`}
              >
                <Play className="h-4 w-5" strokeWidth={2.5} />
                <span className={`font-medium ${styles.secondaryButtonText}`}>
                  Appwrite in 100 seconds
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
