"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

type Brand = {
  name: string;
  icon: string;
};

interface BrandsData {
  success: boolean;
  title: string;
  subtitle: string;
  brands: Brand[];
}

const BrandsPage = () => {
  const [brandsData, setBrandsData] = useState<BrandsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/brands");
        const data = await res.json();
        if (data.success) {
          setBrandsData(data);
        } else {
          setError("Failed to load brands");
        }
      } catch (err) {
        setError("Failed to load brands");
        console.error("Error fetching brands:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="w-11/12 mx-auto my-10">
        <div className="bg-white rounded-xl p-8 text-center min-h-[400px] flex items-center justify-center">
          <div className="text-gray-600">Loading brands...</div>
        </div>
      </div>
    );
  }

  if (error || !brandsData) {
    return (
      <div className="w-11/12 mx-auto my-10">
        <div className="bg-white rounded-xl p-8 text-center min-h-[400px] flex items-center justify-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Error Loading Brands
            </h1>
            <p className="text-gray-600">{error || "Failed to load brands"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto my-10">
      <div className="bg-white rounded-xl overflow-hidden">
        {/* Green Banner Section */}
        <div className="bg-[#1a5f3f] text-white py-12 px-6 md:px-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            {brandsData.title || "Complete List of Brands"}
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-4xl mx-auto text-white/95">
            {brandsData.subtitle || 
              "Like telecom Care services a wide range of smartphone and gadget brands, from flagship to budget-friendly devices, including Apple, Samsung, Xiaomi, OPPO, vivo, Realme, Huawei, and OnePlus. We highlight expert technicians, certified parts, and brand-specific repair standards for reliable service."}
          </p>
        </div>

        {/* Brand Logos Grid */}
        <div className="p-6 md:p-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {brandsData.brands.map((brand, index) => (
              <div
                key={index}
                className="bg-white rounded-xl flex items-center justify-center p-4 md:p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <Image
                  src={brand.icon}
                  alt={brand.name}
                  width={180}
                  height={100}
                  className="object-contain w-full h-auto max-h-20 md:max-h-24"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;

