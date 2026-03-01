/* eslint-disable @next/next/no-img-element */
import React from "react";

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
];

export default function PlaygroundPage() {
  return (
    <div className="flex h-dvh items-center justify-center p-4">
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
                    <div className="hidden h-4 w-[1px] bg-current opacity-50 lg:block"></div>
                    <div>{product.power}</div>
                    <div className="hidden h-4 w-[1px] bg-current opacity-50 lg:block"></div>
                    <div>{product.seer} SEER2</div>
                    <div className="hidden h-4 w-[1px] bg-current opacity-50 lg:block"></div>
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
    </div>
  );
}
