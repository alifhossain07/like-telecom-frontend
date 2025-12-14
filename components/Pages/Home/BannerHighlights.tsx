"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

type Category = {
  id: number;
  name: string;
  image: string;
  icon: string;
};

type Banner = {
  id?: number;
  photo: string;
  url?: string;
  position: number | string;
};

const BannerHighlights = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [leftBanners, setLeftBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        if (res.data?.success) {
          setCategories(res.data.featuredCategories.slice(0, 4));
        }
      } catch (error) {
        console.log("Category load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCategories();
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await fetch("/api/banners", { cache: "no-store" });
        const data = await res.json();
        if (data?.success) {
          setLeftBanners(data.leftBanners || []);
        }
      } catch (error) {
        console.log("Home banner error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const leftBannerImage = leftBanners[0]?.photo;
  const rightBannerImage = leftBanners[1]?.photo;

  // Skeleton component
  const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
  );

  return (
    <div className="w-11/12 mx-auto py-12">
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        {/* Left Banner (556x756) */}
        <div className="flex-1 relative aspect-[556/756] rounded-2xl overflow-hidden shadow-md bg-gray-100">
          {loading ? (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          ) : (
            leftBannerImage && (
              <Image
                src={leftBannerImage}
                alt="Left Banner"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain"
              />
            )
          )}
        </div>

        {/* Middle Category Grid */}
        <div className="flex-1 flex flex-col rounded-2xl shadow-md bg-gradient-to-b from-orange-100 to-orange-300">
          <div className="px-4 sm:px-6 pt-6 pb-3">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center">
              Shop the Best in Each Category
            </h1>
          </div>

          <div className="flex-1 px-4 sm:px-6 pb-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 h-full">
              {loading
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-between p-3 sm:p-4"
                    >
                      <Skeleton className="w-full aspect-[1/1] mb-3" />
                      <Skeleton className="w-3/4 h-3 sm:h-4 md:h-5" />
                    </div>
                  ))
                : categories.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-between p-3 sm:p-4 hover:shadow-lg transition"
                    >
                      <div className="flex-1 w-full flex justify-center items-center">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={450}
                          height={450}
                          className="w-full h-full bg-gray-100 object-contain"
                        />
                      </div>
                      <h1 className="font-bold text-xs sm:text-sm md:text-xl text-gray-800 mt-3 text-center">
                        {item.name}
                      </h1>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Right Banner (556x756) */}
        <div className="flex-1 relative aspect-[556/756] rounded-2xl overflow-hidden shadow-md bg-gray-100">
          {loading ? (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          ) : (
            rightBannerImage && (
              <Image
                src={rightBannerImage}
                alt="Right Banner"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerHighlights;
