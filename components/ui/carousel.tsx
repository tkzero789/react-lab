"use client";

import React, { ComponentPropsWithRef } from "react";

import { cn } from "@/lib/utils";
import "@/app/css/carousel.css";
import { EmblaCarouselType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

const Carousel = React.forwardRef<
  HTMLDivElement,
  { className?: string; children: React.ReactNode }
>(function Carousel({ className, children }, ref) {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl" ref={ref}>
        <div className={cn("carousel__container", className)}>{children}</div>
      </div>
    </div>
  );
});

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("min-w-0 flex-none basis-full", className)} {...props} />
  );
}

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true);

  const onPrevButtonClick = React.useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = React.useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

type PropType = ComponentPropsWithRef<typeof Button>;

const CarouselPrev: React.FC<PropType> = (props) => {
  const { variant, size, className, children, ...restProps } = props;

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("absolute left-6 top-1/2 -translate-y-1/2", className)}
      {...restProps}
    >
      <ChevronLeft />
      {children}
    </Button>
  );
};

const CarouselNext: React.FC<PropType> = (props) => {
  const { variant, size, className, children, ...restProps } = props;

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("absolute right-6 top-1/2 -translate-y-1/2", className)}
      {...restProps}
    >
      <ChevronRight />
      {children}
    </Button>
  );
};

type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

const useDotButton = (
  emblaApi: EmblaCarouselType | undefined,
): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const onDotButtonClick = React.useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onInit = React.useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

const DotButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  );
};

export {
  Carousel,
  CarouselItem,
  usePrevNextButtons,
  CarouselPrev,
  CarouselNext,
  useDotButton,
  DotButton,
};
