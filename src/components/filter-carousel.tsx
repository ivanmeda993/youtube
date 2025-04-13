"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createRef, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface FilterCarouselProps {
  value?: string | null;
  isLoading?: boolean;
  onSelect: (value: string | null) => void;
  data: {
    label: string;
    value: string;
  }[];
}
export const FilterCarousel = ({
  onSelect,
  value,
  isLoading,
  data,
}: FilterCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentValue, setCurrentValue] = useState(0);
  const [count, setCount] = useState(0);
  const initialCheckComplete = useRef(false);
  // Kreiraj niz React ref-ova na TypeScript kompatibilan način
  const itemRefs = useRef<React.RefObject<HTMLDivElement | null>[]>([]);

  // Inicijalizuj niz ref-ova kada se podaci promene
  useEffect(() => {
    if (!data.length) return;
    // +1 za "All" element
    itemRefs.current = Array(data.length + 1)
      .fill(null)
      .map(() => createRef<HTMLDivElement>());
  }, [data.length]);

  // Inicijalizacija API-ja
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);

    const handleSelect = () => {
      setCurrentValue(api.selectedScrollSnap() + 1);
    };

    handleSelect();
    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  // Proveriti vidljivost selektovanog elementa samo jednom pri inicijalizaciji
  useEffect(() => {
    if (!api || !value || initialCheckComplete.current) return;

    // Odredi indeks selektovanog elementa
    const selectedIndex = data.findIndex((item) => item.value === value);

    if (selectedIndex === -1) return;

    // Daj carousel-u vremena da se inicijalizuje
    const timer = setTimeout(() => {
      // Indeks +1 zbog "All" elementa
      const targetIndex = selectedIndex + 1;
      const targetRef = itemRefs.current[targetIndex];

      if (!targetRef?.current) return;

      // Proveri vidljivost elementa
      const rect = targetRef.current.getBoundingClientRect();
      const parentRect =
        targetRef.current.parentElement?.getBoundingClientRect();

      if (!parentRect) return;

      // Element je vidljiv ako se nalazi unutar roditeljskog elementa (carousel-a)
      const isVisible =
        rect.left >= parentRect.left && rect.right <= parentRect.right;

      // Skroluj do elementa samo ako nije vidljiv
      if (!isVisible) {
        console.log(
          `Element nije vidljiv, skrolujem do indeksa ${targetIndex}`,
        );
        api.scrollTo(targetIndex - 1, true);
      } else {
        console.log(`Element je već vidljiv, ne skrolujem`);
      }

      // Označi da je inicijalna provera završena
      initialCheckComplete.current = true;
    }, 300);

    return () => clearTimeout(timer);
  }, [api, value, data]);

  return (
    <div className="relative w-full">
      {/* Left Fade */}
      <div
        className={cn(
          "absolute left-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none",
          currentValue === 1 && "hidden",
        )}
      />
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="w-full px-12"
      >
        <CarouselContent className="-ml-3">
          {isLoading ? (
            <FilterCarouselSkeleton />
          ) : (
            <>
              <CarouselItem
                className="pl-3 basis-auto"
                ref={itemRefs.current[0]}
              >
                <Badge
                  onClick={() => onSelect(null)}
                  variant={value === "" ? "default" : "secondary"}
                  className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
                >
                  All
                </Badge>
              </CarouselItem>

              {data.map((item, index) => (
                <CarouselItem
                  ref={itemRefs.current[index + 1]}
                  onClick={() => onSelect(item.value)}
                  key={item.value}
                  className="pl-3 basis-auto"
                >
                  <Badge
                    className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
                    variant={value === item.value ? "default" : "secondary"}
                  >
                    {item.label}
                  </Badge>
                </CarouselItem>
              ))}
            </>
          )}
        </CarouselContent>
        <CarouselPrevious className="left-0 z-20" />
        <CarouselNext className="right-0 z-20" />
      </Carousel>

      {/* Right Fade */}
      <div
        className={cn(
          "absolute right-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none",
          currentValue === count && "hidden",
        )}
      />
    </div>
  );
};

export const FilterCarouselSkeleton = ({
  length = 14,
}: {
  length?: number;
}) => {
  return (
    <div className="relative w-full gap-3 flex px-12">
      {Array.from({ length }).map((_, i) => (
        <Skeleton
          key={i}
          className="rounded-lg px-3 py-1 h-full text-sm min-w-[100px] font-semibold"
        >
          &nbsp;
        </Skeleton>
      ))}
    </div>
  );
};
