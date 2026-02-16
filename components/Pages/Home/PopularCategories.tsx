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
    <div className="pb-12">
      <div className="w-11/12 mx-auto">

        {/* GRID */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-4">

          {/* LOADING */}
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

          {/* DATA */}
          {!loading &&
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/${cat.slug}`}
                className="w-full border border-gray-200 bg-white rounded-xl p-2 flex flex-col items-center transition hover:shadow-md"
              >
                {/* IMAGE (SAFE) */}
                <div className="w-full h-20 xl:h-32 flex items-center justify-center bg-gray-100 rounded-lg">
                  <Image
                    src={cat.icon || "/images/placeholder.png"}
                    alt={cat.name}
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>

                {/* TITLE */}
                <p className="mt-2 w-full text-center bg-gray-100 rounded-lg px-2 py-1.5 xl:text-sm text-[9px] font-semibold text-gray-800">
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
