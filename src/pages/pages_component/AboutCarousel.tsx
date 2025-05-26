// src/components/about/AboutCarousel.tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";

export default function AboutCarousel() {
  return (
    <div className="relative mb-8">
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <div className="relative">
              <img
                src="/images/images_home/carousel_1.png"
                alt="Indonesia Earthquake Map - Real-time Monitoring"
                width={600}
                height={400}
                className="rounded-lg border border-[#d9dbe1] w-full"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                Peta Monitoring Real-time
              </div>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="relative">
              <img
                src="/images/images_home/carousel_2.png"
                alt="Peringatan Dini Gempa"
                width={600}
                height={400}
                className="rounded-lg border border-[#d9dbe1] w-full"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                Peringatan Dini
              </div>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="relative">
              <img
                src="/images/images_home/carousel_3.png"
                alt="Historical Earthquake Trends"
                width={600}
                height={400}
                className="rounded-lg border border-[#d9dbe1] w-full"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                Peringatan Tsunami
              </div>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="relative">
              <img
                src="/images/images_home/carousel_5.png"
                alt="BMKG Integration System"
                width={600}
                height={400}
                className="rounded-lg border border-[#d9dbe1] w-full"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                Detail Event
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
}
