"use client";

import Image from "next/image";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  slug: string;
  icon: string;
};

const PopularCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        if (res.data?.success) {
          setCategories(res.data.featuredCategories);
        }
      } catch (error) {
        console.log("Category load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCategories();
  }, []);

  return (
    <div className="md:pb-8 pb-6">
      <div className="w-11/12 mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-4">

          {/* LOADING SKELETON */}
          {loading &&
            Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="w-full border border-gray-200 bg-white rounded-xl p-2 animate-pulse"
              >
                <div className="w-full h-20 xl:h-32 bg-gray-200 rounded-lg" />
                <div className="mt-2 h-4 bg-gray-200 rounded-md" />
              </div>
            ))}

          {/* DATA CARDS */}
          {!loading &&
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/${cat.slug}`}
                /* Added 'group' and shadow-orange hover effects */
                className="group w-full border border-gray-200 bg-white rounded-xl p-2 flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:shadow-orange-200/50 hover:border-orange-200"
              >
                {/* IMAGE CONTAINER */}
                <div className="w-full h-20 xl:h-32 flex items-center justify-center bg-orange-50 group-hover:bg-orange-100 rounded-lg transition-colors duration-300 overflow-hidden">
                  <div className="relative w-16 h-16 xl:w-24 xl:h-24 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={cat.icon || "/images/placeholder.png"}
                      alt={cat.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* TITLE */}
                <p className="mt-2 w-full text-center bg-orange-100 group-hover:bg-orange-200 rounded-lg px-2 py-1.5 xl:text-sm text-[9px] font-semibold text-gray-800 transition-colors duration-300">
                  {cat.name}
                </p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCategories;