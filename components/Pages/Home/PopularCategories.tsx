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
  banner: string;
  cover_image: string;
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
    <div className="pb-16">
      <div className="w-10/12 mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-12 md:gap-44 justify-items-center">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="w-44 sm:w-48 md:w-52 lg:w-56 rounded-2xl border border-gray-200 bg-white shadow-sm p-4 flex flex-col items-center animate-pulse"
                >
                  <div className="w-full h-48 sm:h-52 bg-gray-200 rounded-xl" />
                  <div className="mt-3 w-24 h-6 bg-gray-200 rounded-xl" />
                </div>
              ))
            : categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products/${cat.slug}`}
                  className="w-44 sm:w-48 md:w-52 lg:w-56 rounded-xl border border-gray-200 bg-white shadow-sm p-2 flex flex-col items-center transition-transform duration-200 hover:scale-105"
                >
                  <div className="w-full h-48 sm:h-52 flex justify-center items-center bg-gray-100 rounded-xl overflow-hidden">
                    <Image
                      src={cat.icon || "/images/placeholder.png"}
                      alt={cat.name}
                      width={250}
                      height={250}
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-3 w-full text-center bg-gray-100 rounded-xl px-6 py-2 text-sm sm:text-base font-semibold text-gray-800">
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
