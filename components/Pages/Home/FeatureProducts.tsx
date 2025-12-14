"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import ProductCard from "@/components/ui/ProductCard";

// ----- Product Interface -----
interface Spec {
  text: string;
  icon: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: number;
  reviews: number;
  image: string;
  slug: string;
  featured_specs?: Spec[];
}

const FeatureProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(true);


  // ----- Detect screen size -----
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ----- Fetch Products -----
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>("/api/products/featureproducts");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ----- Pagination logic -----
  const PRODUCTS_PER_PAGE = isMobile ? 6 : 5;
  const MAX_DESKTOP_PRODUCTS = 10;
  const paginatedProducts = isMobile
    ? products.slice(0, PRODUCTS_PER_PAGE)
    : products.slice(0, MAX_DESKTOP_PRODUCTS);

  // ----- Skeleton Card -----
  const SkeletonCard: React.FC = () => (
    <div className="relative w-full max-w-[320px] rounded-lg shadow-md border border-gray-200 p-0 animate-pulse flex flex-col justify-between">
      <div className="relative flex items-center justify-center bg-gray-100 md:p-14 p-8 rounded-md">
        <div className="md:w-[100px] w-[40px] h-[100px] md:h-[100px] bg-gray-300 rounded"></div>
      </div>
      <div className="p-3 space-y-3">
        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-4 w-2/4 bg-gray-300 rounded"></div>
        <div className="flex gap-2 mt-3">
          <div className="w-1/2 h-10 bg-gray-300 rounded-md"></div>
          <div className="w-1/2 h-10 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-11/12 mx-auto mb-[56px] pt-4 pb-4 p-2 sm:bg-transparent bg-orange-100 rounded-xl sm:rounded-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        {/* Mobile Header */}
        <div className="flex items-center sm:hidden w-full justify-between">
          <h1 className="text-2xl w-1/2 font-medium">Recommended For You</h1>
          <button className="bg-[#EB6420] text-white px-4 text-[12px] py-2 rounded-xl">
            See More
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex flex-col items-center w-full">
          <h1 className="text-4xl font-medium">Recommended For You</h1>
          <p className="text-gray-600 text-lg mt-2">
            Discover Our Latest Arrivals Designed to Inspire and Impress
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-5 justify-items-center">
        {loading
          ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : paginatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {/* See More button - desktop only */}
      {!loading && !isMobile && products.length > MAX_DESKTOP_PRODUCTS && (
        <div className="flex justify-center mt-6">
          <button className="bg-[#EB6420] text-white px-6 py-3 rounded-xl hover:bg-gray-200 hover:text-black transition duration-300">
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default FeatureProducts;
