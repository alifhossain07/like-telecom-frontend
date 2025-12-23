"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import SmartPhoneBrandsSkeleton from "@/components/Skeletons/SmartPhoneBrandsSkeleton";

type Brand = {
  name: string;
  icon: string;
};

const SmartPhoneBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/brands");
        const data = await res.json();
        if (data.success) {
          setBrands(data.brands || []);
          setTitle(data.title || "");
          setSubtitle(data.subtitle || "");
        } else {
          setError("Failed to load brands");
        }
      } catch  {
        setError("Failed to load brands");
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) {
    return <SmartPhoneBrandsSkeleton />;
  }

  return (
    <div className="w-11/12 py-3 xl:p-10 flex flex-col md:flex-row mx-auto xl:items-center bg-gray-200 rounded-2xl">
      <div className="py-5 md:w-1/2 px-4">
        <h1 className="text-xl md:text-3xl md:text-left md:w-8/12 font-bold text-gray-800 mb-4">
          {title}
        </h1>
        <p className="text-gray-600 text-justify mb-6 leading-relaxed">
          {subtitle}
        </p>
        <button className="bg-orange-600 hover:bg-orange-700 text-white md:px-6 md:py-2 px-3 py-1 flex items-center rounded-3xl font-medium transition">
          Shop The New Arrivals Today
          <FiChevronRight className="text-white text-lg ml-1" />
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      {/* Brand Logos */}
      <div className="grid grid-cols-2 items-center md:w-1/2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4 ">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="bg-white rounded-xl flex items-center justify-center p-6 hover:shadow-lg transition cursor-pointer"
          >
            <Image
              src={brand.icon}
              alt={brand.name}
              width={180}
              height={100}
              className="object-contain w-auto h-16 md:h-20"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartPhoneBrands;