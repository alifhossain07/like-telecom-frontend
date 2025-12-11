"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { HiArrowSmLeft, HiArrowSmRight } from "react-icons/hi";

type Slider = {
  id: number;
  photo: string;
};

type Banner = {
  id: number;
  photo: string;
  position: number | string;
};

const HeroSlider = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [sideBanners, setSideBanners] = useState<Banner[]>([]);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  // Fetch data
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const res = await fetch("/api/banners", { cache: "no-store" });
        const data = await res.json();
        setSideBanners(data.rightBanners || []);
        setSliders(data.sliders || []);
      } catch (e) {
        console.error("Home API load error", e);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  // Autoplay slider
  useEffect(() => {
    if (sliders.length === 0) return;
    slideInterval.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliders.length);
    }, 3500);
    setIsLoaded(true);
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [sliders]);

  // Manual slide
  const goTo = (index: number) => setCurrent(index);
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? sliders.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrent((prev) => (prev === sliders.length - 1 ? 0 : prev + 1));

  return (
    <div className="w-11/12 mx-auto pt-16 pb-[16px]">
      <div className="flex gap-3 md:gap-5 overflow-hidden w-full justify-center h-[350px] md:h-[500px] lg:h-[600px] xl:h-[450px]">
        {/* LEFT SIDE IMAGE */}
        <div className="hidden md:block flex-[3] relative rounded-md overflow-hidden">
          {loading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse rounded-md" />
          ) : sideBanners[0] ? (
            <Image
              src={sideBanners[0].photo}
              alt="left banner"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : null}
        </div>

        {/* MIDDLE SLIDER */}
        <div className="flex-[5] relative rounded-md overflow-hidden">
          {loading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse rounded-md" />
          ) : (
            <div
              className={`relative w-full h-full transition-opacity duration-500 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="overflow-hidden w-full h-full relative">
                <div
                  className="flex w-full h-full transition-transform duration-700"
                  style={{ transform: `translateX(-${current * 100}%)` }}
                >
                  {sliders.map((slide, idx) => (
                    <div className="w-full h-full flex-shrink-0 relative" key={idx}>
                      <Image
                        src={slide.photo}
                        alt={`slider-${idx}`}
                        fill
                        priority={idx === 0}
                        className="object-fill"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ARROWS */}
              <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
                <button
                  onClick={prevSlide}
                  className="text-white bg-black/40 hover:bg-orange-400 p-2 rounded-full"
                >
                  <HiArrowSmLeft />
                </button>
                <button
                  onClick={nextSlide}
                  className="text-white bg-black/40 hover:bg-orange-400 p-2 rounded-full"
                >
                  <HiArrowSmRight />
                </button>
              </div>

              {/* DOTS */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {sliders.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`w-3 h-3 rounded-full transition ${
                      i === current
                        ? "bg-white"
                        : "bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="hidden md:block flex-[3] relative rounded-md overflow-hidden">
          {loading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse rounded-md" />
          ) : sideBanners[1] ? (
            <Image
              src={sideBanners[1].photo}
              alt="right banner"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
