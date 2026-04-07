import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Contact } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Avatar from "@/public/images/playground/my-avatar.webp";

function Intro() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Image and Name */}
          <Image
            src={Avatar}
            width="60"
            height="60"
            alt="Avatar"
            className="rounded-full border"
          />
          <div className="flex flex-col">
            <div>Thinh Tran</div>
            <div className="text-sm text-muted-foreground">
              Full Stack Software Engineer
            </div>
          </div>
        </div>
        {/* Socials */}
        {/* <ul className="grid grid-cols-4 gap-2">
          <li>
            <Button asChild variant="outline" size="icon-sm">
              <Link href="">
                <Contact />
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="outline" size="icon-sm">
              <Link href="">
                <Contact />
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="outline" size="icon-sm">
              <Link href="">
                <Contact />
              </Link>
            </Button>
          </li>
        </ul> */}
      </div>
      <p className="mt-4 text-sm">
        Building web applications from concept to launch.
      </p>
    </div>
  );
}

export default function NewPortfolioPage() {
  return (
    <Container className="max-w-2xl py-20">
      <Intro />
    </Container>
  );
}
