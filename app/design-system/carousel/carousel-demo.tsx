"use client"

/* Carousel demos, because the component needs the Embla hook */
import useEmblaCarousel from "embla-carousel-react"

import { ButtonGroup } from "@/components/ui/button-group"
import {
  Carousel,
  CarouselContainer,
  CarouselItem,
  CarouselNext,
  CarouselPrev,
  DotButton,
  useDotButton,
  usePrevNextButtons,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

const slides = [1, 2, 3, 4, 5]

function Slide({ index, className }: { index: number; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-32 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground",
        className
      )}
    >
      Slide {index}
    </div>
  )
}

export function CarouselBasic() {
  const [emblaRef, emblaApi] = useEmblaCarousel()
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Carousel ref={emblaRef}>
        <CarouselContainer className="flex gap-3">
          {slides.map((index) => (
            <CarouselItem key={index}>
              <Slide index={index} />
            </CarouselItem>
          ))}
        </CarouselContainer>
      </Carousel>
      <ButtonGroup className="self-end">
        <CarouselPrev
          variant="outline"
          size="icon-sm"
          aria-label="Previous slide"
          disabled={prevBtnDisabled}
          onClick={onPrevButtonClick}
        />
        <CarouselNext
          variant="outline"
          size="icon-sm"
          aria-label="Next slide"
          disabled={nextBtnDisabled}
          onClick={onNextButtonClick}
        />
      </ButtonGroup>
    </div>
  )
}

export function CarouselMultiple() {
  const [emblaRef] = useEmblaCarousel({ align: "start", slidesToScroll: "auto" })

  return (
    <Carousel ref={emblaRef} className="w-full max-w-sm">
      <CarouselContainer className="flex gap-3">
        {slides.map((index) => (
          <CarouselItem key={index} className="basis-1/2">
            <Slide index={index} />
          </CarouselItem>
        ))}
      </CarouselContainer>
    </Carousel>
  )
}

export function CarouselDots() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Carousel ref={emblaRef}>
        <CarouselContainer className="flex gap-3">
          {slides.map((index) => (
            <CarouselItem key={index}>
              <Slide index={index} />
            </CarouselItem>
          ))}
        </CarouselContainer>
      </Carousel>
      <div className="flex justify-center gap-1.5">
        {scrollSnaps.map((snap, index) => (
          <DotButton
            key={snap}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => onDotButtonClick(index)}
            className={cn(
              "size-1.5 rounded-full bg-border transition-colors",
              index === selectedIndex && "bg-foreground"
            )}
          />
        ))}
      </div>
    </div>
  )
}
