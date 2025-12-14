"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";

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
}

const NewArrival = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(true);

  // Check screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const PRODUCTS_PER_PAGE = isMobile ? 6 : 5;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/products/new-arrivals");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  return (
    <div className="w-11/12 mx-auto mb-[56px] pb-4 pt-4 p-2 sm:bg-transparent bg-orange-100 rounded-xl sm:rounded-none">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-7">
        {/* Mobile Header */}
        <div className="flex items-center sm:hidden w-full justify-between">
          <h1 className="text-2xl font-medium">New Arrival</h1>
          <button className="bg-[#EB6420] text-white px-4 text-[12px] py-2 rounded-xl">
            See More
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex flex-col items-center w-full">
          <h1 className="text-4xl font-medium">New Arrival Products</h1>
          <p className="text-gray-600 text-lg mt-2">Discover our latest arrivals</p>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {loading
          ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
              <div
                key={i}
                className="w-full h-60 bg-gray-200 animate-pulse rounded-xl"
              />
            ))
          : paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>

      {/* Pagination - desktop only */}
      {!loading && !isMobile && products.length > PRODUCTS_PER_PAGE && (
        <div className="hidden sm:flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-md ${
                page === i + 1 ? "bg-[#EB6420] text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewArrival;
