/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ExternalLink, FileText, X } from "lucide-react";
import Link from "next/link";

const products = [
  {
    title: "CH-RH12MASTWM-230VI",
    img: "https://cdn.shopify.com/s/files/1/0672/8512/3119/files/ch-wallmount-astoria-front.png?v=1748976897",
    zone: "Single/Multi-zone",
    series: "Astoria",
    btu: "12,000",
    power: "230V",
    seer: "25.5",
    refrig: "R454B",
    original_price: "452.00",
    sale_price: "361.60",
    original_lineset_price: "176.00",
    sale_lineset_price: "149.60",
  },
  {
    title: "CH-RH18MASTWM-230VI",
    img: "https://cdn.shopify.com/s/files/1/0672/8512/3119/files/ch-wallmount-astoria-front.png?v=1748976897",
    zone: "Single/Multi-zone",
    series: "Astoria",
    btu: "18,000",
    power: "230V",
    seer: "24.0",
    refrig: "R454B",
    original_price: "620.00",
    sale_price: "496.00",
    original_lineset_price: "210.00",
    sale_lineset_price: "178.50",
  },
  {
    title: "CH-RH24MOLYWM-230VI",
    img: "https://coolmansupply.com/cdn/shop/files/ch-wallmount-oliviamidnight-front.png?v=1749501345&width=1220",
    zone: "Multi-zone",
    series: "Olympia",
    btu: "24,000",
    power: "230V",
    seer: "21.5",
    refrig: "R454B",
    original_price: "820.00",
    sale_price: "656.00",
    original_lineset_price: "260.00",
    sale_lineset_price: "221.00",
  },
  {
    title: "CH-RH24MASTWM-230VI",
    img: "https://cdn.shopify.com/s/files/1/0672/8512/3119/files/ch-wallmount-astoria-front.png?v=1748976897",
    zone: "Single/Multi-zone",
    series: "Astoria",
    btu: "24,000",
    power: "230V",
    seer: "22.5",
    refrig: "R454B",
    original_price: "780.00",
    sale_price: "624.00",
    original_lineset_price: "240.00",
    sale_lineset_price: "204.00",
  },
  {
    title: "CH-RH09MALPWM-115VI",
    img: "https://coolmansupply.com/cdn/shop/files/ch-wallmount-olivia-front.png?v=1764093793&width=1220",
    zone: "Single-zone",
    series: "Alpine",
    btu: "9,000",
    power: "115V",
    seer: "20.0",
    refrig: "R410A",
    original_price: "390.00",
    sale_price: "312.00",
    original_lineset_price: "150.00",
    sale_lineset_price: "127.50",
  },
  {
    title: "CH-RH12MALPWM-115VI",
    img: "https://coolmansupply.com/cdn/shop/files/ch-wallmount-olivia-front.png?v=1764093793&width=1220",
    zone: "Single-zone",
    series: "Alpine",
    btu: "12,000",
    power: "115V",
    seer: "19.0",
    refrig: "R410A",
    original_price: "430.00",
    sale_price: "344.00",
    original_lineset_price: "165.00",
    sale_lineset_price: "140.25",
  },
  {
    title: "CH-RH18MOLYWM-230VI",
    img: "https://coolmansupply.com/cdn/shop/files/ch-wallmount-olivia-front.png?v=1764093793&width=12207",
    zone: "Multi-zone",
    series: "Olympia",
    btu: "18,000",
    power: "230V",
    seer: "23.0",
    refrig: "R454B",
    original_price: "650.00",
    sale_price: "520.00",
    original_lineset_price: "220.00",
    sale_lineset_price: "187.00",
  },
];

export default function PlaygroundPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex w-full max-w-4xl flex-col gap-4">
        {products.map((product, index) => (
          <div key={index} className="rounded-2xl border bg-neutral-100 p-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              Zone {index + 1}
              <div className="text-blue-700">Change</div>
            </div>
            {/* Unit */}
            <div className="flex flex-col gap-4">
              {/* Details */}
              <div className="flex items-center gap-4">
                {/* Image */}
                <img
                  src={product.img}
                  alt="product"
                  height="80"
                  width="80"
                  className="flex size-20 items-center justify-center rounded-2xl bg-white p-1"
                />
                {/* Info */}
                <div className="flex flex-col gap-4">
                  {/* Title/Series */}
                  <div className="flex flex-col">
                    <div>{product.title}</div>
                    <div className="flex items-center gap-2">
                      <div>{product.zone}</div>
                      <div className="size-1 rounded-full bg-neutral-300"></div>
                      <div>{product.series}</div>
                    </div>
                  </div>
                  {/* Spec */}
                  <div className="grid grid-cols-2 gap-x-4 lg:flex lg:items-center">
                    <div>{product.btu} BTU</div>
                    <div className="hidden h-4 border-l border-current opacity-50 lg:block"></div>
                    <div>{product.power}</div>
                    <div className="hidden h-4 border-l border-current opacity-50 lg:block"></div>
                    <div>{product.seer} SEER2</div>
                    <div className="hidden h-4 border-l border-current opacity-50 lg:block"></div>
                    <div>{product.refrig}</div>
                  </div>
                </div>
              </div>
              {/* Price */}
              <div className="grid grid-cols-2 gap-8 border-t pt-2">
                {/* Unit */}
                <div className="border-r">
                  <div className="font-medium opacity-50">Unit price</div>
                  <div className="font-medium">
                    {product.sale_price}{" "}
                    <span className="text-sm text-red-500">(20% off)</span>
                  </div>
                  <div className="line-through opacity-80">
                    {product.original_price}
                  </div>
                </div>
                {/* Lineset */}
                <div>
                  <div className="font-medium opacity-50">16ft line set</div>
                  <div className="font-medium">
                    {product.sale_lineset_price}{" "}
                    <span className="text-sm text-red-500">(20% off)</span>
                  </div>
                  <div className="line-through opacity-80">
                    {product.original_lineset_price}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {/* Sheet V2 */}
        <Sheet>
          <SheetTrigger asChild>
            <Button>Select Unit V2</Button>
          </SheetTrigger>
          <SheetContent className="min-w-full overflow-y-auto p-0 lg:min-w-[640px]">
            <SheetHeader className="flex flex-row items-center gap-4 border-b border-neutral-300 p-4">
              <SheetClose asChild>
                <Button variant="muted" size="icon-sm">
                  <ChevronLeft />
                </Button>
              </SheetClose>
              <SheetTitle>Select Unit</SheetTitle>
              <SheetClose asChild className="ml-auto">
                <Button variant="muted" size="icon-sm">
                  <X />
                </Button>
              </SheetClose>
            </SheetHeader>
            <div className="flex flex-col gap-4 p-4">
              {products.map((product) => (
                <div
                  key={product.title}
                  className="group flex cursor-pointer flex-col gap-4 rounded-xl border border-neutral-300 p-4 transition-all hover:bg-neutral-100 lg:flex"
                >
                  <div className="flex items-center justify-between">
                    {/* Img & Info */}
                    <div className="flex w-full items-center gap-4">
                      {/* Img */}
                      <img
                        src={product.img}
                        width="80"
                        height="80"
                        alt={product.title}
                        className="rounded-xl bg-white p-1"
                      />
                      <div className="flex flex-1 flex-col items-center gap-4 lg:flex-row lg:justify-between">
                        {/* Info */}
                        <div className="flex w-full flex-col gap-4 whitespace-nowrap lg:w-auto">
                          {/* Name */}
                          <div>
                            <div className="font-medium">{product.title}</div>
                            <div className="flex items-center gap-2 text-xs">
                              {product.zone}
                              <div className="size-1 rounded-full bg-muted-foreground"></div>
                              {product.series}
                            </div>
                          </div>
                          {/* Specs */}
                          <div className="grid w-fit grid-cols-2 gap-x-4">
                            <div>{product.btu} BTU</div>{" "}
                            <div>{product.power}V</div>
                            <div>{product.seer} SEER2</div>{" "}
                            <div>{product.refrig}</div>
                          </div>
                        </div>
                        {/* Price */}
                        <div className="flex w-full flex-col whitespace-nowrap lg:w-auto">
                          <div className="flex gap-1">
                            <div className="font-medium">
                              ${product.sale_price}
                            </div>
                            <span className="font-medium tracking-tighter text-red-500">
                              (15% off)
                            </span>
                          </div>
                          <div className="text-muted-foreground line-through">
                            {product.original_lineset_price}
                          </div>
                          <div className="text-green-600">20 - Santa Clara</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Links */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      asChild
                      variant="outline"
                      className="border-neutral-300 shadow-none"
                    >
                      <Link href="">
                        Details <ExternalLink />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-neutral-300 shadow-none"
                    >
                      <Link href="">
                        Submittals <ExternalLink />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Sheet V3 */}
        <Sheet>
          <SheetTrigger asChild>
            <Button>Select Unit V3</Button>
          </SheetTrigger>
          <SheetContent className="min-w-full overflow-y-auto p-0 lg:min-w-[640px]">
            <SheetHeader className="flex flex-row items-center gap-4 border-b border-neutral-300 p-4">
              <SheetClose asChild>
                <Button variant="muted" size="icon-sm">
                  <ChevronLeft />
                </Button>
              </SheetClose>
              <SheetTitle>Select Unit</SheetTitle>
              <SheetClose asChild className="ml-auto">
                <Button variant="muted" size="icon-sm">
                  <X />
                </Button>
              </SheetClose>
            </SheetHeader>
            <div className="flex flex-col gap-4 p-4">
              {products.map((product) => (
                <div
                  key={product.title}
                  className="group flex cursor-pointer flex-col gap-4 rounded-xl border border-neutral-300 transition-all hover:bg-neutral-100 lg:flex"
                >
                  <div className="flex items-center justify-between px-4 pt-4">
                    {/* Img & Info */}
                    <div className="flex w-full items-center gap-4">
                      {/* Img */}
                      <img
                        src={product.img}
                        width="80"
                        height="80"
                        alt={product.title}
                        className="rounded-xl bg-white p-1"
                      />
                      <div className="flex flex-1 flex-col items-center gap-4 lg:flex-row lg:justify-between">
                        {/* Info */}
                        <div className="flex w-full flex-col gap-4 whitespace-nowrap lg:w-auto">
                          {/* Name */}
                          <div>
                            <div className="font-medium">{product.title}</div>
                            <div className="flex items-center gap-2 text-xs">
                              {product.zone}
                              <div className="size-1 rounded-full bg-muted-foreground"></div>
                              {product.series}
                            </div>
                          </div>
                          {/* Specs */}
                          <div className="grid w-fit grid-cols-2 gap-x-4">
                            <div>{product.btu} BTU</div>{" "}
                            <div>{product.power}V</div>
                            <div>{product.seer} SEER2</div>{" "}
                            <div>{product.refrig}</div>
                          </div>
                        </div>
                        {/* Price */}
                        <div className="flex w-full flex-col whitespace-nowrap lg:w-auto">
                          <div className="flex gap-1">
                            <div className="font-medium">
                              ${product.sale_price}
                            </div>
                            <span className="font-medium tracking-tighter text-red-500">
                              (15% off)
                            </span>
                          </div>
                          <div className="text-muted-foreground line-through">
                            {product.original_lineset_price}
                          </div>
                          <div className="text-green-600">20 - Santa Clara</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Links */}
                  <div className="grid grid-cols-2 gap-4 border-t border-neutral-300">
                    <Button
                      asChild
                      variant="link"
                      className="rounded-none border-r border-neutral-300 font-normal underline shadow-none hover:text-[#245ee1]"
                    >
                      <Link href="">
                        <ExternalLink /> Details
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="link"
                      className="rounded-none border-r border-neutral-300 font-normal underline shadow-none hover:text-[#245ee1]"
                    >
                      <Link href="">
                        <FileText /> Submittals
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
