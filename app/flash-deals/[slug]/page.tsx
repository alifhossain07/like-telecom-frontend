"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaStar } from "react-icons/fa";
import ProductOptionsModal from "@/components/ui/ProductOptionsModal";

interface Product {
  id: number;
  slug: string;
  name: string;
  thumbnail_image: string;
  main_price: string;
  stroked_price: string;
  discount: string;
  has_discount: boolean;
  rating: number;
  featured_specs: Array<{ text: string; icon: string }>;
}

interface FlashDeal {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  banner_subtitle_top: string | null;
  banner_title: string | null;
  banner_subtitle_bottom: string | null;
  banner: string;
  date: number;
  products: {
    data: Product[];
  };
}

const FlashDealDetailsPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  
  const [flashDeal, setFlashDeal] = useState<FlashDeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  const productsPerPage = 10;
  const totalPages = flashDeal ? Math.ceil((flashDeal.products?.data?.length || 0) / productsPerPage) : 0;

  useEffect(() => {
    const fetchFlashDeal = async () => {
      try {
        const res = await axios.get("/api/products/flashsale");
        if (res.data.success && res.data.data) {
          const deal = res.data.data.find((d: FlashDeal) => d.slug === slug);
          if (deal) {
            setFlashDeal(deal);
          }
        }
      } catch (error) {
        console.error("Error fetching flash deal:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchFlashDeal();
    }
  }, [slug]);

  // Countdown timer
  useEffect(() => {
    if (!flashDeal) return;

    const endTime = flashDeal.date * 1000;
    
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timeRemaining = endTime - currentTime;

      if (timeRemaining <= 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [flashDeal]);

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const visibleProducts = flashDeal?.products?.data?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="w-11/12 mx-auto pt-10 pb-[56px] min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flash deal...</p>
        </div>
      </div>
    );
  }

  if (!flashDeal) {
    return (
      <div className="w-11/12 mx-auto pt-10 pb-[56px] min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Flash deal not found.</p>
          <Link href="/flash-deals" className="text-orange-600 hover:underline mt-4 inline-block">
            View All Flash Deals
          </Link>
        </div>
      </div>
    );
  }

  const bannerTitle = flashDeal.banner_title || flashDeal.title;
  const bannerDescription = flashDeal.banner_subtitle_bottom || flashDeal.subtitle || "";

  return (
    <div className="w-11/12 mx-auto pt-10 pb-[56px] min-h-[80vh]">
      {/* Banner Section */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          {bannerTitle}
        </h1>
        
        {bannerDescription && (
          <div className="text-sm md:text-base text-gray-700 mb-6 leading-relaxed max-w-4xl mx-auto">
            <p className="mb-2">{bannerDescription}</p>
          </div>
        )}

        {/* Countdown Timer - Dark boxes */}
        <div className="flex justify-center gap-3 md:gap-4 mb-8">
          <div className="bg-gray-800 text-white rounded-lg py-4 px-4 md:px-6 flex flex-col items-center justify-center min-w-[70px] md:min-w-[80px]">
            <span className="text-xl md:text-2xl font-bold leading-none">{String(countdown.days).padStart(2, '0')}</span>
            <span className="text-xs md:text-sm font-medium mt-1">Days</span>
          </div>
          <div className="bg-gray-800 text-white rounded-lg py-4 px-4 md:px-6 flex flex-col items-center justify-center min-w-[70px] md:min-w-[80px]">
            <span className="text-xl md:text-2xl font-bold leading-none">{String(countdown.hours).padStart(2, '0')}</span>
            <span className="text-xs md:text-sm font-medium mt-1">Hours</span>
          </div>
          <div className="bg-gray-800 text-white rounded-lg py-4 px-4 md:px-6 flex flex-col items-center justify-center min-w-[70px] md:min-w-[80px]">
            <span className="text-xl md:text-2xl font-bold leading-none">{String(countdown.minutes).padStart(2, '0')}</span>
            <span className="text-xs md:text-sm font-medium mt-1">Mins</span>
          </div>
          <div className="bg-gray-800 text-white rounded-lg py-4 px-4 md:px-6 flex flex-col items-center justify-center min-w-[70px] md:min-w-[80px]">
            <span className="text-xl md:text-2xl font-bold leading-none">{String(countdown.seconds).padStart(2, '0')}</span>
            <span className="text-xs md:text-sm font-medium mt-1">Sec</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {visibleProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-10">
            {visibleProducts.map((product) => {
              const discountAmount = Math.round(
                parseFloat(product.stroked_price.replace(/[^\d.]/g, "")) - 
                parseFloat(product.main_price.replace(/[^\d.]/g, ""))
              );
              
              return (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition relative overflow-hidden flex flex-col"
                >
                  {/* Save Badge - Green */}
                  {discountAmount > 0 && (
                    <div className="absolute top-2 left-2 z-10 bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded">
                      Save ৳ {discountAmount.toLocaleString('en-US')}
                    </div>
                  )}

                  {/* Product Image */}
                  <Link
                    href={`/${product.slug}`}
                    className="relative w-full h-48 bg-gray-50 flex items-center justify-center p-4"
                  >
                    <Image
                      src={product.thumbnail_image}
                      alt={product.name}
                      width={150}
                      height={150}
                      className="object-contain"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <Link href={`/${product.slug}`}>
                      <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[40px]">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Stock Status */}
                    <div className="text-xs text-green-600 mb-2">Stock: Available</div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-xs text-gray-600">({product.rating || 0})</span>
                    </div>

                    {/* Price */}
                    <div className="mb-4 flex-1">
                      <span className="text-orange-600 font-bold text-base md:text-lg">
                        {product.main_price}
                      </span>
                      {product.has_discount && product.stroked_price !== product.main_price && (
                        <span className="text-gray-400 line-through text-sm ml-2">
                          {product.stroked_price}
                        </span>
                      )}
                    </div>

                    {/* Buy Product Button */}
                    <button
                      onClick={() => setSelectedProduct(product.slug)}
                      className="w-full bg-[#EB6420] text-white py-2.5 px-4 rounded-lg hover:bg-[#d4561a] transition font-medium text-sm"
                    >
                      Buy Product
                    </button>
                  </div>

                  {/* Product Options Modal */}
                  {selectedProduct === product.slug && (
                    <ProductOptionsModal
                      slug={product.slug}
                      open={selectedProduct === product.slug}
                      onClose={() => setSelectedProduct(null)}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 border rounded-md text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  &lt; Back
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1.5 border rounded-md text-sm font-medium ${
                      currentPage === page
                        ? "bg-black text-white border-black"
                        : "hover:bg-gray-100 border-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 border rounded-md text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Next &gt;
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products available in this flash deal.</p>
        </div>
      )}
    </div>
  );
};

export default FlashDealDetailsPage;

