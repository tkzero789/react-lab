/* Carousel docs with a preview for each layout and control */
import type { Metadata } from "next"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"

import DocsHeader from "../components/docs-header"
import { Example, Preview } from "../components/example"
import {
  CarouselBasic,
  CarouselDots,
  CarouselMultiple,
} from "./carousel-demo"

export const metadata: Metadata = {
  title: "Carousel",
  description: "A row of slides the user scrolls through.",
}

export default function CarouselPage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          { title: "Design System", href: "/design-system" },
          { title: "Carousel" },
        ]}
      />
      <DashboardContainer className="flex max-w-4xl flex-col gap-12 py-8">
        <div className="flex flex-col gap-6">
          <DocsHeader
            title="Carousel"
            description="A row of slides the user scrolls through."
          />
          <Preview className="min-h-60">
            <CarouselBasic />
          </Preview>
        </div>

        <Example
          title="Setup"
          description={
            <>
              Call <code>useEmblaCarousel()</code> in a client component and
              pass the ref to <code>Carousel</code>. Put the slides in{" "}
              <code>CarouselContainer</code> as <code>CarouselItem</code>.
            </>
          }
        >
          <CarouselBasic />
        </Example>

        <Example
          title="Several Per View"
          description={
            <>
              Set the width of the item with a basis class, such as{" "}
              <code>basis-1/2</code>. Pass{" "}
              <code>{'{ align: "start", slidesToScroll: "auto" }'}</code> to the
              hook.
            </>
          }
        >
          <CarouselMultiple />
        </Example>

        <Example
          title="Dots"
          description={
            <>
              Use <code>useDotButton()</code> for the position, and{" "}
              <code>DotButton</code> for each dot. Pass{" "}
              <code>{"{ loop: true }"}</code> to the hook to wrap around.
            </>
          }
        >
          <CarouselDots />
        </Example>

        <Example
          title="Buttons"
          description={
            <>
              <code>usePrevNextButtons()</code> returns the handlers and the
              disabled state for <code>CarouselPrev</code> and{" "}
              <code>CarouselNext</code>, so the arrows turn off at each end.
            </>
          }
        >
          <CarouselBasic />
        </Example>
      </DashboardContainer>
    </>
  )
}
