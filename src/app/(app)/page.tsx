"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import messages from "@/app/messages.json";
export default function Home() {
  return (
    <main>
      <section>
        <h1>Dive into anonymous conversations!</h1>
        <p>
          Discover a world where every message is anonymous and private. Share
          confidential thoughts, feelings, and experiences without fear of
          judgment.
        </p>
      </section>
      <Carousel
        plugins={[
          AutoPlay({
            delay: 3000,
          }),
        ]}
        className="w-full max-w-xs"
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardHeader>{message.title}</CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">
                      {message.content}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
}
