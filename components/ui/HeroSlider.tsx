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

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? sliders.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrent((prev) => (prev === sliders.length - 1 ? 0 : prev + 1));
  const goTo = (index: number) => setCurrent(index);

  return (
    <div className="w-11/12 mx-auto pt-5 xl:pt-7 pb-4">
      <div className="flex gap-3 md:gap-5 w-full justify-center items-stretch">

        {/* LEFT SIDE BANNER (466x450) */}
        <div className="hidden md:block flex-[3] relative aspect-[466/450] rounded-md overflow-hidden bg-gray-100">
          {loading ? (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          ) : (
            sideBanners[0] && (
              <Image
                src={sideBanners[0].photo}
                alt="left banner"
                fill
                className="object-contain"
              />
            )
          )}
        </div>

        {/* MAIN SLIDER (776x450) */}
        <div className="flex-[5] relative aspect-[776/450] rounded-md overflow-hidden bg-gray-100">
          {loading ? (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          ) : (
            <>
              <div
                className={`relative w-full h-full transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"
                  }`}
              >
                <div className="overflow-hidden w-full h-full">
                  <div
                    className="flex w-full h-full transition-transform duration-700"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                  >
                    {sliders.map((slide, idx) => (
                      <div
                        key={idx}
                        className="relative w-full h-full flex-shrink-0"
                      >
                        <Image
                          src={slide.photo}
                          alt={`slider-${idx}`}
                          fill
                          priority={idx === 0}
                          className="object-contain"
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
                    <HiArrowSmLeft size={22} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="text-white bg-black/40 hover:bg-orange-400 p-2 rounded-full"
                  >
                    <HiArrowSmRight size={22} />
                  </button>
                </div>

                {/* DOTS */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {sliders.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`w-3 h-3 rounded-full transition ${i === current
                        ? "bg-white"
                        : "bg-white/40 hover:bg-white/70"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT SIDE BANNER (466x450) */}
        <div className="hidden md:block flex-[3] relative aspect-[466/450] rounded-md overflow-hidden bg-gray-100">
          {loading ? (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          ) : (
            sideBanners[1] && (
              <Image
                src={sideBanners[1].photo}
                alt="right banner"
                fill
                className="object-contain"
              />
            )
          )}
        </div>

      </div>
    </div>
  );
};

export default HeroSlider;
