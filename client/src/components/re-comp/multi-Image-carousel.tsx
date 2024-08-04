import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface Props {
  State: number;
  setState: React.Dispatch<React.SetStateAction<number>>;
}

export default function ReMultiImageCarousel({ State, setState }: Props) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-52 sm:max-w-xs md:max-w-sm"
    >
      <CarouselContent>
        {Array.from({ length: 15 }).map((_, index) => (
          <CarouselItem
            key={index}
            onClick={() => setState(index + 1)}
            className="md:basis-1/2 lg:basis-1/3 flex justify-center items-center cursor-pointer"
          >
            <Image
              src={`/avatars/${index + 1}.jpeg`}
              alt="avatar"
              width={150}
              height={150}
              className={State === index + 1 ? "border-2 border-black" : ""}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious type="button" />
      <CarouselNext type="button" />
    </Carousel>
  );
}
